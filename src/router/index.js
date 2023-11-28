import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Detail from '../views/Detail.vue';
import IndexedDB from '../views/IndexedDB.vue';
import usePwaStore from '../stores/pwa';
import LoginForm from '../components/LoginForm.vue';

const routes = [
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
    path: '/',
    component: Home,
    beforeEnter: (to, from, next) => {
      usePwaStore().resetDeferredPrompt();
      next();
    },
  },

  {
    path: '/login',
    component: LoginForm,
  },

  {
    path: '/index-db',
    component: IndexedDB,
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

export default router;
