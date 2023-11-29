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

      <div v-if="htmlsLoading" class="font-semibold text-xl">
        강의를 불러오는 중입니다...
      </div>

      <div v-else-if="htmls.length > 0" class="overflow-x-auto w-full">
        <h1 class="my-3 text-xl text-left text-blue-400 font-semibold">
          강의 내용
        </h1>

        <div class="w-full flex flex-col gap-3 border rounded-md">
          <iframe
            class="w-full h-64"
            title="chapter"
            :src="isOnline ? htmls[htmlsIndex] : null"
            :srcdoc="isOnline ? null : htmls[htmlsIndex]"
          />

          <div class="w-full flex justify-between p-2">
            <button
              :class="
                htmlsIndex === 0
                  ? 'bg-gray-300 text-white p-2 rounded-md cursor-not-allowed'
                  : 'bg-red-300 text-white p-2 rounded-md'
              "
              @click="handleHtmlChange(-1)"
            >
              이전 페이지
            </button>
            <button
              :class="
                htmlsIndex === htmls.length - 1
                  ? 'bg-gray-300 text-white p-2 rounded-md cursor-not-allowed'
                  : 'bg-blue-300 text-white p-2 rounded-md'
              "
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

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';
import { URL } from '../constants';
import useNetworkStore from '../stores/network';
import LoadingSpinner from '../components/LoadingSpinner.vue';
/* eslint-disable */
const router = useRouter();
const store = useNetworkStore();
const { isOnline } = storeToRefs(store);
const { courseCode } = router.currentRoute.value.params;
const classInfoDetail = ref('');
const apiUrl = '/api/class-info';

const htmls = ref([]);
const htmlsLoading = ref(false);
const htmlsIndex = ref(0);

const sendMessageToServiceWorker = (type, url) => {
  navigator.serviceWorker.controller.postMessage({
    type,
    url,
    courseCode,
  });
};

const handleFetchError = () => {
  htmlsLoading.value = true;

  if (navigator.serviceWorker.controller) {
    sendMessageToServiceWorker('data', apiUrl);
    sendMessageToServiceWorker('html', apiUrl);
  }
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

const fetchHtmlData = async (data) => {
  return new Promise((resolve) => {
    htmls.value = data;
    resolve();
  });
};

const handleServiceWorkerMessage = async (event) => {
  const { cachedData, type } = await JSON.parse(event.data);

  if (type === 'html') {
    await fetchHtmlData(cachedData);
    htmlsLoading.value = false;
  } else if (type === 'data') {
    classInfoDetail.value = cachedData[0];
  }
};

const mouserClick = (e) => {
  switch (e.button) {
    case 3:
      handleHtmlChange(-1);
      break;
    case 4:
      handleHtmlChange(1);
      break;
    default:
      break;
  }
};

onMounted(async () => {
  if (!isOnline.value) {
    handleFetchError();
  } else {
    await fetchData();
  }

  window.addEventListener('mouseup', mouserClick);

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
</script>
