<template>
  <NavBar />
  <div
    class="flex justify-between items-center text-xs border rounded-md p-2 m-2 w-full"
    v-for="(item, index) in classInfoData"
    :key="index"
  >
    <div class="flex flex-col gap-3">
      <h1 class="text-md">{{ item.courseName }}</h1>
      <h2 class="self-start">{{ item.instructorName }}</h2>
    </div>

    <img class="w-14 h-14 rounded-md" :src="item.courseThumbnail" alt="logo" />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'HomeVue',
  components: {
    NavBar,
  },

  setup() {
    const classInfoData = ref([]);

    const getClassInfo = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/class-info',
        );
        classInfoData.value = response.data;
      } catch (err) {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('data');
        }
      }
    };

    onBeforeMount(async () => {
      await getClassInfo();
      console.log('onMounted: ', classInfoData.value);
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('서비스 워커에서 메시지 수신: 데이터 있음');
      classInfoData.value = JSON.parse(event.data);
    });

    return {
      classInfoData,
    };
  },
};
</script>
