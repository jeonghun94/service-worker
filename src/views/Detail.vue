<template>
  <LoadingSpinner v-if="!classInfoDetail" />
  <div v-else class="flex flex-col box-border">
    <NavBar />
    <div
      class="flex flex-col justify-between items-start gap-3 text-xs p-2 w-full mt-8"
    >
      <div class="w-full my-3 flex justify-center items-center gap-3">
        <div class="flex items-center gap-3 p-2 box-border">
          <img
            :src="classInfoDetail.courseThumbnail"
            class="w-12 h-12 rounded-md"
            alt="logo"
          />
          <h1 class="text-md font-semibold">
            {{ classInfoDetail.courseName }}
          </h1>
        </div>
      </div>

      <div v-if="htmls.length > 0" class="overflow-x-auto w-full">
        <h1 class="my-3 text-xl text-left text-blue-400 font-semibold">
          강의 내용 {{ isOnline ? 'ON' : 'OFF' }}
        </h1>

        <div class="w-full flex flex-col gap-3 border rounded-md">
          <iframe
            class="w-full h-64"
            :src="isOnline ? htmls[htmlsIndex] : null"
            :srcdoc="isOnline ? null : htmls[htmlsIndex]"
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
      </div>

      <div v-else>
        <h3 class="font-semibold text-xl">등록된 강의 내용이 없습니다!..</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';
import { URL } from '../constants';
import useNetworkStore from '../stores/network';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'DetailVue',
  components: { NavBar, LoadingSpinner },
  setup() {
    const router = useRouter();
    const { courseCode } = router.currentRoute.value.params;
    const dynamicHTML = ref('');
    const classInfoDetail = ref('');
    const apiUrl = '/api/class-info';

    const store = useNetworkStore();
    const { isOnline } = storeToRefs(store);

    const htmls = ref([]);
    const htmlsIndex = ref(0);

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

    const handleBack = () => {
      router.push('/');
    };

    const handleHtmlChange = (change) => {
      const newIndex = htmlsIndex.value + change;
      if (newIndex >= 0 && newIndex < htmls.value.length) {
        htmlsIndex.value = newIndex;
      }
    };

    const fetchData = async () => {
      try {
        const {
          data: [detailData],
        } = await axios.get(`${URL + apiUrl}-detail?courseCode=${courseCode}`);
        classInfoDetail.value = await detailData;
        htmls.value = await detailData?.contents?.htmls;
      } catch (error) {
        handleFetchError();
      }
    };

    const handleServiceWorkerMessage = async (event) => {
      const { cachedData, type } = await JSON.parse(event.data);

      if (type === 'html') {
        htmls.value = cachedData;
      } else if (type === 'data') {
        /* eslint-disable */
        classInfoDetail.value = cachedData[0];
      }
    };

    onMounted(async () => {
      if (!isOnline.value) {
        handleFetchError();
      } else {
        await fetchData();
      }

      navigator.serviceWorker.addEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    });

    watch(isOnline, async (newValue, oldValue) => {
      if (newValue) {
        await fetchData();
      } else {
        handleFetchError();
      }
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
