<template>
  <div class="flex flex-col box-border">
    <NavBar />
    <div
      class="flex flex-col justify-between items-start gap-3 text-xs p-2 w-full mt-8"
      v-for="(item, index) in classInfoDetail"
      :key="index"
    >
      <div class="w-full my-3 flex justify-center items-center gap-3">
        <div class="flex flex-col gap-3">
          <h1 class="text-md font-semibold">{{ item.courseName }}</h1>
        </div>
      </div>

      <div v-if="item?.contents" class="overflow-x-auto w-full">
        <h1 class="my-3 text-xl text-left text-blue-400 font-semibold">
          강의 내용
        </h1>
        <div class="flex gap-3 mb-3" v-if="item.contents?.images?.length > 0">
          <img
            v-for="(content, contentIndex) in item.contents.images"
            class="w-8 h-8 rounded-md"
            :key="contentIndex"
            :src="content"
            alt="logo"
          />
        </div>

        <div
          v-if="item.contents?.htmls?.length > 0"
          class="w-full flex flex-col gap-3 border rounded-md"
        >
          <iframe
            class="w-full h-64"
            :src="isOnline ? htmls[htmlsIndex] : null"
            :srcdoc="!isOnline ? htmls[htmlsIndex] : null"
          />

          <div class="w-full flex justify-between p-2">
            <button
              class="bg-red-300 text-white p-2 rounded-md"
              @click="handleHtmlChange(-1)"
            >
              이전 페이지
            </button>
            <button
              class="bg-blue-300 text-white p-2 rounded-md"
              @click="handleHtmlChange(1)"
            >
              다음 페이지
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
import NavBar from '../components/NavBar.vue';
import { URL } from '../constants';

export default {
  name: 'DetailVue',
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
