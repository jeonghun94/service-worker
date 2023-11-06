<template>
  <NavBar />
  <button @click="sendMessage" class="text-red-500">
    서비스 워커에 <br />
    메세지 보내기
  </button>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'vuex-vue',
  components: { NavBar },
  setup() {
    const router = useRouter();
    const count = ref(0);
    // 알림 표시
    function showNotification() {
      if ('Notification' in window) {
        const options = {
          title: '알림 제목',
          body: '알림 내용',
          icon: 'http://localhost:5173/src/assets/vue.svg',
        };

        const notification = new Notification(options.title, options);

        notification.onclick = () => {
          // 알림 클릭 시 수행할 동작
          window.open('https://www.naver.com');
        };
      }
    }

    function requestNotificationPermission() {
      if ('Notification' in window) {
        showNotification();
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            // 사용자가 알림 권한을 승인한 경우
            showNotification();
          }
        });
      }
    }

    const sendMessage = () => {
      navigator.serviceWorker.controller.postMessage('Hello World');
    };

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('서비스 워커에서 메시지 발신: ', event.data);
      count.value++;
      router.push('/about');
    });

    navigator.serviceWorker.addEventListener('messageerror', (event) => {
      console.log('서비스 워커에서 메시지 발신 에러: ', event);
    });

    return { sendMessage, requestNotificationPermission };
  },
};
</script>
