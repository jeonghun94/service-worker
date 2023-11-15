<template>
  <NavBar />
  <button
    type="button"
    @click="handleLogout()"
    class="bg-blue-300 text-white rounded-md py-1 px-3 box-border"
  >
    logout
  </button>
  <div
    class="flex justify-between items-center text-xs border rounded-md p-2 m-2 w-full"
    v-for="(item, index) in classInfoData"
    :key="index"
  >
    <router-link :to="'/course/' + item.courseCode" class="text-black">
      <div class="flex flex-col gap-3">
        <h1 class="text-md">{{ item.courseName }}</h1>
        <h2 class="self-start">{{ item.instructorName }}</h2>
      </div>
    </router-link>
    <img class="w-14 h-14 rounded-md" :src="item.courseThumbnail" alt="logo" />
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import NavBar from '../NavBar.vue';
import { URL } from '../../constants';

export default {
  name: 'CourseList',
  components: {
    NavBar,
  },
  setup() {
    const { dispatch, getters } = useStore();
    const classInfoData = ref([]);
    const apiUrl = '/api/class-info';
    const user = getters['user/getUser'];

    const sendMessageToServiceWorker = (type, url) => {
      navigator.serviceWorker.controller.postMessage({
        type,
        url,
      });
    };

    const handleFetchError = () => {
      if (navigator.serviceWorker.controller) {
        sendMessageToServiceWorker('data', apiUrl);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(URL + apiUrl);
        classInfoData.value = response.data;
      } catch (err) {
        handleFetchError();
      }
    };

    const handleLogout = async () => {
      await dispatch('user/setIsLogin', false);
      if (user.social.Kakao) {
        Kakao.Auth.logout();
      }
    };

    onMounted(async () => {
      await fetchData();
      navigator.serviceWorker.addEventListener('message', async (event) => {
        const { cachedData } = await JSON.parse(event.data);
        classInfoData.value = cachedData;
      });
    });

    return {
      classInfoData,
      handleLogout,
    };
  },
};
</script>
