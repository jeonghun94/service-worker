import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

/* eslint-disable */
Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');

createApp(App)
  .use(router)
  .use(store)
  .use(MotionPlugin)
  .use(pinia)
  .mount('#app');
