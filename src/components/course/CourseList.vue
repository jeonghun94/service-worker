<template>
  <NavBar />
  <div class="mt-8">
    <div
      v-for="(group, title) in filteredClassInfoData"
      :key="title"
      class="mb-5"
    >
      <h2 class="text-lg text-left text-blue-400 font-bold">{{ title }}</h2>
      <div
        v-for="(item, index) in group"
        :key="index"
        class="flex justify-between items-center text-xs border rounded-md p-3 w-full my-3"
      >
        <router-link :to="'/course/' + item.courseCode" class="text-black">
          <div class="flex flex-col gap-3">
            <h1 class="font-semibold text-[1.5rem]">
              {{ item.courseName }}
            </h1>
            <p class="flex gap-1">
              <span>{{ item.instructorName }}</span>
              <span>/</span>
              <span>{{ item.startDate }}</span>
            </p>
          </div>
        </router-link>
        <img
          class="w-14 h-14 rounded-md"
          :src="item.courseThumbnail"
          alt="logo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
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

    const fetchData = async () => {
      try {
        const response = await axios.get(URL + apiUrl);
        classInfoData.value = response.data;
      } catch (err) {
        handleFetchError();
      }
    };

    onMounted(async () => {
      await fetchData();

      navigator.serviceWorker.addEventListener('message', async (event) => {
        const { cachedData } = await JSON.parse(event.data);
        classInfoData.value = cachedData;
      });
    });

    const filteredClassInfoData = computed(() => {
      const today = new Date();
      const yesterday = new Date(today);
      const tomorrow = new Date(today);

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const groupedData = {
        '전일 수강 목록': [],
        '금일 수강 목록': [],
        '내일 수강 목록': [],
      };

      classInfoData.value.forEach((item) => {
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
    });

    return {
      filteredClassInfoData,
      classInfoData,
    };
  },
};
</script>
