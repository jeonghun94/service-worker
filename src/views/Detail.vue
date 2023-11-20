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
      <button class="flex items-center bg-gray-400 text-white">
        <!-- 설치 -->
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

      <div v-if="item?.contents" class="overflow-x-auto w-full">
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
            :src="isOnline ? htmls[htmlsIndex] : null"
            :srcdoc="!isOnline ? htmls[htmlsIndex] : null"
            frameborder="0"
          />

          <div class="w-full p-2 flex justify-between">
            <button
              class="bg-red-300 text-white p-2 rounded-md"
              @click="handleHtmlChange(-1)"
            >
              이전 HTML
            </button>
            <button
              class="bg-blue-300 text-white p-2 rounded-md"
              @click="handleHtmlChange(1)"
            >
              다음 HTML
            </button>
          </div>
        </div>

        <div v-else>
          <h4>html 콘텐츠가 없습니다</h4>
        </div>
      </div>
      <div v-else>
        <h4>콘텐츠가 없습니다</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
    const dynamicHTML = ref('');
    const classInfoDetail = ref({});
    const apiUrl = '/api/class-info';
    const isOnline = ref(navigator.onLine);

    const htmls = ref([]);
    const htmlsIndex = ref(0);

    const handleConnectionChange = () => {
      isOnline.value = navigator.onLine;
    };

    const sendMessageToServiceWorker = (type, url) => {
      navigator.serviceWorker.controller.postMessage({
        type,
        url,
        courseCode,
      });
    };

    const handleFetchError = () => {
      if (navigator.serviceWorker.controller) {
        sendMessageToServiceWorker('data', apiUrl);
        sendMessageToServiceWorker('html', apiUrl);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${URL + apiUrl}-detail?courseCode=${courseCode}`,
        );
        classInfoDetail.value = response.data;
        htmls.value = response.data[0].contents?.htmls;
      } catch (error) {
        handleFetchError();
      }
    };

    const handleBack = () => {
      router.push('/');
    };

    const handleHtmlChange = (change) => {
      const newIndex = htmlsIndex.value + change;
      if (newIndex >= 0 && newIndex < htmls.value.length) {
        htmlsIndex.value = newIndex;
      }
    };

    onMounted(async () => {
      await fetchData();
      window.addEventListener('online', handleConnectionChange);
      window.addEventListener('offline', handleConnectionChange);

      navigator.serviceWorker.addEventListener('message', async (event) => {
        const { cachedData, type } = await JSON.parse(event.data);
        if (type === 'html') {
          htmls.value = cachedData;
        } else if (type === 'data') {
          classInfoDetail.value = cachedData;
        }
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    });

    return {
      courseCode,
      classInfoDetail,
      dynamicHTML,
      isOnline,
      htmls,
      htmlsIndex,

      handleBack,
      handleHtmlChange,
    };
  },
};
</script>
