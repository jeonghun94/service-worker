/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Offline from '../views/Offline.vue';
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/offline',
    component: Offline,
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

export default router;
