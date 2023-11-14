<template>
  <div class="flex flex-col box-border">
    <NavBar />
    <div class="w-full my-3 flex justify-between items-center box-border">
      <button
        class="flex items-center bg-gray-400 text-white"
        @click="handleBack"
      >
        뒤로
      </button>
      <h1 class="font-bold">{{ courseCode }}</h1>
      <button
        class="flex items-center bg-gray-400 text-white"
        @click="installPWA"
      >
        설치
      </button>
    </div>

    <div
      class="flex flex-col justify-between items-start gap-3 text-xs border p-2 w-full"
      v-for="(item, index) in classInfoDetail"
      :key="index"
    >
      <div class="w-full my-3 flex justify-between items-center gap-3">
        <div class="flex flex-col gap-3">
          <h1 class="text-md">{{ item.courseName }}</h1>
          <h2 class="self-start">{{ item.instructorName }}</h2>
        </div>
        <img
          class="w-20 h-14 rounded-md"
          :src="item.courseThumbnail"
          alt="logo"
        />
      </div>

      <div v-if="item?.contents" class="overflow-x-auto">
        <h1 class="text-left my-3 text-blue-400">이미지 콘텐츠</h1>
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

        <div
          v-if="item.contents?.videos?.length > 0"
          class="flex flex-col gap-3"
        >
          <h1 class="text-left my-3 text-blue-400">동영상 콘텐츠</h1>
          <video
            v-for="(content, contentIndex) in item.contents.videos"
            class="w-full h-52 border object-fill border-black rounded-md"
            :key="contentIndex"
            :src="content"
            autoplay
            controls
          />
        </div>
        <div v-else>
          <h4>동영상 콘텐츠가 없습니다</h4>
        </div>

        <div
          v-if="item.contents?.htmls?.length > 0"
          class="flex flex-col gap-3"
        >
          <h1 class="text-left my-3 text-blue-400">아이프레임 콘텐츠</h1>
          <iframe
            class="border w-full h-96"
            :src="item.contents?.htmls[0]"
            frameborder="0"
          ></iframe>
        </div>
        <div v-else>
          <h4>html 콘텐츠가 없습니다</h4>
        </div>

        <!-- <div v-if="item.contents?.pdf?.length > 0">
          <vue-pdf-embed :source="item.contents?.pdf[0]" />
        </div>
        <div v-else>
          <h4>PDF 콘텐츠가 없습니다</h4>
        </div> -->
      </div>
      <div v-else>
        <h4>콘텐츠가 없습니다</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// import VuePdfEmbed from 'vue-pdf-embed';
import NavBar from '../components/NavBar.vue';
import { URL } from '../constants';

export default {
  name: 'DetailVue',
  // components: { VuePdfEmbed, NavBar },
  components: { NavBar },
  setup() {
    const router = useRouter();
    const { courseCode } = router.currentRoute.value.params;

    const classInfoDetail = ref({});
    const apiPath = `/api/class-info-detail?courseCode=${courseCode}`;
    const getClassInfoDetail = async () => {
      try {
        const response = await axios.get(URL + apiPath);
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

      window.addEventListener('beforeinstallprompt', (event) => {
        console.log('before install prompt');
        event.prompt();
      });
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      classInfoDetail.value = JSON.parse(event.data);
    });

    const deferredPrompt = ref(null);

    // beforeinstallprompt 이벤트 핸들러 등록
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      console.log(e);
      deferredPrompt.value = e;
    };

    // install 메서드 정의
    const installPWA = async () => {
      console.log(deferredPrompt.value);

      if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
      }
    }; // 컴포넌트가 마운트되기 전에 이벤트 핸들러 등록

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return {
      courseCode,
      classInfoDetail,
      handleBack,
      installPWA,
    };
  },
};
</script>
