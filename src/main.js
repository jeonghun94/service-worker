import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import useNetworkStore from './stores/network';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const handleNetworkChange = () => {
  const { setIsOnline } = useNetworkStore(pinia);
  const isOnline = navigator.onLine;
  setIsOnline(isOnline);
};

window.addEventListener('online', handleNetworkChange);
window.addEventListener('offline', handleNetworkChange);

/* eslint-disable */
Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');

createApp(App).use(router).use(MotionPlugin).use(pinia).mount('#app');
