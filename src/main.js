import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

/* eslint-disable */
window.addEventListener('beforeinstallprompt', (event) => {
  // 설치 프롬프트를 막고 사용자 지정 버튼을 만들어 프롬프트를 수동으로 트리거하는 예제
  event.preventDefault();
  const installButton = document.getElementById('install-button');

  installButton.addEventListener('click', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('The app is already installed');
      return;
    }

    // 이미 프롬프트가 표시된 경우 또 호출하지 않도록 확인
    if (event.prompt) {
      event.prompt();
      event.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      });
    }
  });

  installButton.style.display = 'block';
});

window.addEventListener('appinstalled', (event) => {
  console.log('App installed:', event);
});
Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');
createApp(App).use(router).use(store).mount('#app');
