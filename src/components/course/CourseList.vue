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
import { ref, onBeforeMount } from 'vue';
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
    const apiPath = '/api/class-info';
    const user = getters['user/getUser'];

    const getClassInfo = async () => {
      try {
        const response = await axios.get(`${URL + apiPath}`);
        classInfoData.value = response.data;
      } catch (err) {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'data',
            url: apiPath,
          });
        }
      }
    };

    const handleLogout = async () => {
      await dispatch('user/setIsLogin', false);
      if (user.social.Kakao) {
        Kakao.Auth.logout();
      }
    };

    onBeforeMount(async () => {
      await getClassInfo();
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      classInfoData.value = JSON.parse(event.data.data);
    });

    return {
      classInfoData,

      handleLogout,
    };
  },
};
</script>
