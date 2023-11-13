import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

/* eslint-disable */
Kakao.init('21a3ba5a34d345b07bbad4098bb4619f');
createApp(App).use(router).use(store).mount('#app');
