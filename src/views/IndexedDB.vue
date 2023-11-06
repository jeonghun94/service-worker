<template>
  <NavBar />
  <div class="flex flex-col gap-3">
    <button @click="handleSelect">데이터 조회</button>
    <button @click="handleInsert">데이터 넣기</button>
    <button @click="handleDelete">데이터 삭제</button>
    <button @click="handleUpdate">데이터 수정</button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  ctoolDBOpen,
  ctoolTableReset,
  ctoolSelect,
  ctoolInsert,
  ctoolDelete,
  ctoolUpdate,
} from '../libs/indexedDB';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'vuex-vue',
  setup() {
    const count = ref(0);
    onMounted(async () => {
      await ctoolDBOpen();
    });
    onBeforeUnmount(async () => {
      await ctoolTableReset();
    });
    const handleSelect = async () => {
      const rows = await ctoolSelect();
      console.log(rows);
    };
    const handleInsert = async () => {
      await ctoolInsert(++count.value, 'val');
      const rows = await ctoolSelect();
      console.log(rows);
    };
    const handleDelete = async () => {
      await ctoolDelete(1);
    };
    const handleUpdate = async () => {
      await ctoolUpdate(1, 'val2');
    };
    // 알림 표시
    const requestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      console.log(permission);
    };
    const sendMessage = () => {
      navigator.serviceWorker.controller.postMessage({
        type: 'message',
        data: 'hello',
      });
    };
    return {
      handleSelect,
      handleInsert,
      handleDelete,
      handleUpdate,
      requestNotificationPermission,
      sendMessage,
    };
  },
  components: { NavBar },
};
</script>
