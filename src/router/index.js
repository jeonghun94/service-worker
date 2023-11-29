import { createRouter, createWebHistory } from 'vue-router';
import HomeContainer from '../views/HomeContainer.vue';
import DetailContainer from '../views/DetailContainer.vue';
import LoginForm from '../components/LoginForm.vue';

const routes = [
  {
    path: '/course',
    children: [
      {
        path: ':courseCode',
        component: DetailContainer,
      },
    ],
  },
  {
    path: '/',
    component: HomeContainer,
  },

  {
    path: '/login',
    component: LoginForm,
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
});

export default router;
