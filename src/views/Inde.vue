<template>
  <NavBar />
  <div class="flex justify-start gap-10">
    <button @click="handleBack">뒤로</button>
    <h1>{{ courseCode }}</h1>
  </div>
  <div
    class="flex flex-col justify-between items-start gap-3 text-xs border rounded-md p-2 m-2 w-full"
    v-for="(item, index) in classInfoDetail"
    :key="index"
  >
    <div class="flex justify-between items-center gap-3">
      <div class="flex flex-col gap-3">
        <h1 class="text-md">{{ item.courseName }}</h1>
        <h2 class="self-start">{{ item.instructorName }}</h2>
      </div>
      <img
        class="w-14 h-14 rounded-md"
        :src="item.courseThumbnail"
        alt="logo"
      />
    </div>
    <div v-if="item.contents" class="flex gap-3">
      <img
        v-for="(content, contentIndex) in item.contents"
        class="w-4 h-4 rounded-md"
        :key="contentIndex"
        :src="content"
        alt="logo"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'DetailVue',
  setup() {
    const router = useRouter();
    const { courseCode } = router.currentRoute.value.params;

    const classInfoDetail = ref({});
    const apiPath = `/api/class-info-detail?courseCode=${courseCode}`;
    const getClassInfoDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000${apiPath}`);
        classInfoDetail.value = response.data;
      } catch (error) {
        if (navigator.serviceWorker.controller) {
          console.log('서비스 워커에 데이터 요청');
          navigator.serviceWorker.controller.postMessage({
            type: 'data',
            url: apiPath,
          });
        }
      }
    };

    const handleBack = () => {
      router.back();
    };

    onMounted(async () => {
      await getClassInfoDetail();
      console.log('onMounted: ', classInfoDetail.value);
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('서비스 워커에서 메시지 수신: 데이터 있음');
      classInfoDetail.value = JSON.parse(event.data);
    });

    return {
      courseCode,
      classInfoDetail,
      handleBack,
    };
  },
  components: { NavBar },
};
</script>
