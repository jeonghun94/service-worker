/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Vuex from '../views/Vuex.vue';
import IndexedDB from '../views/IndexedDB.vue';
import ServiceWorker from '../views/ServiceWorker.vue';
import CourseDetail from '../views/Inde.vue';

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
    path: '/indexed-db',
    component: IndexedDB,
  },
  {
    path: '/vuex',
    component: Vuex,
  },
  {
    path: '/service-worker',
    component: ServiceWorker,
  },
  {
    path: '/course',
    children: [
      {
        path: ':courseCode',
        component: CourseDetail,
      },
    ],
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

export default router;
