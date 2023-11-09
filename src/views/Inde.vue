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

    <div v-if="item?.contents">
      <div v-if="item.contents?.images?.length > 0" class="flex gap-3">
        <img
          v-for="(content, contentIndex) in item.contents.images"
          class="w-8 h-8 rounded-md"
          :key="contentIndex"
          :src="content"
          alt="logo"
        />
      </div>
      <div v-else>
        <h4>이미지 콘텐츠가 없습니다</h4>
      </div>

      <div v-if="item.contents?.videos?.length > 0" class="flex gap-3">
        <video
          v-for="(content, contentIndex) in item.contents.videos"
          class="w-full h-24 rounded-md"
          :key="contentIndex"
          :src="content"
          autoplay
          controls
        ></video>
      </div>
      <div v-else>
        <h4>동영상 콘텐츠가 없습니다</h4>
      </div>

      <div v-if="item.contents?.pdf?.length > 0">
        <vue-pdf-embed :source="item.contents?.pdf[0]" />
      </div>
      <div v-else>
        <h4>PDF 콘텐츠가 없습니다</h4>
      </div>
    </div>
    <div v-else>
      <h4>콘텐츠가 없습니다</h4>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import VuePdfEmbed from 'vue-pdf-embed';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'DetailVue',
  components: { VuePdfEmbed, NavBar },
  setup() {
    const router = useRouter();
    const { courseCode } = router.currentRoute.value.params;

    const classInfoDetail = ref({});
    const apiPath = `/api/class-info-detail?courseCode=${courseCode}`;
    const getClassInfoDetail = async () => {
      try {
        const response = await axios.get(
          `https://service-worker-api.vercel.app${apiPath}`,
          // `http://localhost:3000${apiPath}/`,
        );
        classInfoDetail.value = response.data;
      } catch (error) {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'data',
            url: apiPath,
            cacheingUrl: '/api/class-info',
            cacheingKey: courseCode,
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
      classInfoDetail.value = JSON.parse(event.data);
    });

    return {
      courseCode,
      classInfoDetail,
      handleBack,
    };
  },
};
</script>
