<template>
  <div class="card">
    <button type="button" @click="requestNotificationPermission">
      Notification Access
    </button>

    <button @click="sendMessage">
      서비스 워커에 <br />
      메세지 보내기
    </button>

    <h1>count: {{ count }}</h1>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    function requestNotificationPermission() {
      if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            // 사용자가 알림 권한을 승인한 경우
            showNotification();
          }
        });
      }
    }

    const count = ref(0);

    // 알림 표시
    function showNotification() {
      if ("Notification" in window) {
        const options = {
          title: "알림 제목",
          body: "알림 내용",
          icon: "http://localhost:5173/src/assets/vue.svg",
        };

        const notification = new Notification(options.title, options);

        notification.onclick = function () {
          // 알림 클릭 시 수행할 동작
          window.open("https://www.naver.com");
        };
      }
    }

    const sendMessage = () => {
      navigator.serviceWorker.controller.postMessage("Hello World");
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("서비스 워커에서 메시지 발신: ", event.data);
        count.value++;
      });
    };

    return {
      count,

      requestNotificationPermission,
      sendMessage,
    };
  },
};
</script>
