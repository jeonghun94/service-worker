/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Detail from '../views/Detail.vue';
import IndexedDB from '../views/IndexedDB.vue';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/course',
    children: [
      {
        path: ':courseCode',
        component: Detail,
      },
    ],
  },
  {
    path: '/indexed-db',
    component: IndexedDB,
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

export default router;
