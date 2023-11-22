<template>
  <NavBar />
  <div class="mt-8">
    <div v-for="(group, title) in classInfoData" :key="title" class="mb-5">
      <h2 class="text-lg text-left text-blue-400 font-bold">{{ title }}</h2>
      <router-link
        v-for="(item, index) in group"
        :key="index"
        :to="'/course/' + item.courseCode"
      >
        <div
          class="flex justify-between items-center text-xs border rounded-md p-3 w-full my-3"
        >
          <div class="flex flex-col gap-3 text-black">
            <h1 class="self-start font-semibold text-[1.5rem]">
              {{ item.courseName }}
            </h1>
            <p class="flex gap-1">
              <span>{{ item.instructorName }}</span>
              <span>/</span>
              <span>{{ item.startDate }}</span>
            </p>
          </div>
          <img
            class="w-14 h-14 rounded-md"
            :src="item.courseThumbnail"
            alt="logo"
          />
        </div>
      </router-link>
      <div
        v-if="group.length === 0"
        class="flex justify-center items-center mt-3 font-semibold"
      >
        <h1 class="text-xl">{{ title }}이 없습니다.</h1>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { URL } from '../../constants';
import NavBar from '../NavBar.vue';

export default {
  name: 'CourseList',
  components: {
    NavBar,
  },
  setup() {
    const classInfoData = ref([]);
    const apiUrl = '/api/class-info';

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

    const filteredClassInfoData = (data) => {
      const today = new Date();
      const yesterday = new Date(today.getTime());
      const tomorrow = new Date(today.getTime());
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const groupedData = {
        '전일 수강 목록': [],
        '금일 수강 목록': [],
        '내일 수강 목록': [],
      };

      data.forEach((item) => {
        const startDateString = formatDate(new Date(item.startDate));
        if (startDateString === formatDate(yesterday)) {
          groupedData['전일 수강 목록'].push(item);
        } else if (startDateString === formatDate(today)) {
          groupedData['금일 수강 목록'].push(item);
        } else if (startDateString === formatDate(tomorrow)) {
          groupedData['내일 수강 목록'].push(item);
        }
      });

      return groupedData;
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(URL + apiUrl);
        classInfoData.value = filteredClassInfoData(response.data);
      } catch (err) {
        handleFetchError();
      }
    };

    onMounted(async () => {
      await fetchData();
      navigator.serviceWorker.addEventListener('message', async (event) => {
        const { cachedData, type } = await JSON.parse(event.data);
        if (type === 'data') {
          classInfoData.value = filteredClassInfoData(cachedData);
        }
      });
    });

    return {
      classInfoData,
    };
  },
};
</script>
