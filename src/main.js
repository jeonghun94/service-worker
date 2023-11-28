import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import useNetworkStore from './stores/network';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

let isOnline = navigator.onLine;

// 온/오프라인 이벤트 핸들러
const handleOnline = () => {
  isOnline = true;
  // 필요한 경우 스토어의 상태 업데이트
  const { setIsOnline } = useNetworkStore(pinia);
  setIsOnline(isOnline);
};

const handleOffline = () => {
  isOnline = false;
  // 필요한 경우 스토어의 상태 업데이트
  const { setIsOnline } = useNetworkStore(pinia);
  setIsOnline(isOnline);
};

// 온/오프라인 이벤트 리스너 등록
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

/* eslint-disable */
Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');

createApp(App)
  .use(router)
  .use(store)
  .use(MotionPlugin)
  .use(pinia)
  .mount('#app');
