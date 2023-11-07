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

// router.beforeEach((to, from, next) => {
//   if (navigator.onLine) {
//     // 온라인 상태
//     next();
//   } else {
//     // 오프라인 상태
//     if (to.path === '/') {
//       // 홈 페이지로 리디렉션
//       next();
//     } else {
//       next('/');
//     }
//   }
// });

export default router;
