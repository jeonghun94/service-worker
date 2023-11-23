import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

/* eslint-disable */
window.addEventListener('beforeinstallprompt', (event) => {
  // 설치 프롬프트를 막고 사용자 지정 버튼을 만들어 프롬프트를 수동으로 트리거하는 예제
  event.preventDefault();
  const installBanner = document.querySelector('#installBanner');

  installBanner.addEventListener('click', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('The app is already installed');
      return;
    }

    if (event.prompt) {
      event.prompt();
      event.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted prompt');
        } else {
          console.log('User dismissed prompt');
        }
      });
    }
  });
});

window.addEventListener('appinstalled', (event) => {
  localStorage.setItem('isInstallable', true);
  console.log('App installed:', event);
});

Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');
createApp(App).use(router).use(store).use(MotionPlugin).mount('#app');
