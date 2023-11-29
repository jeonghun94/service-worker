<template>
  <div
    class="absolute top-0 left-0 w-full flex justify-between items-center gap-3 py-2 px-3 border-b bg-white"
  >
    <div>
      <h1 class="text-lg font-extrabold">
        {{ isOnline ? 'ON' : 'OFF' }}
      </h1>
      <button
        v-if="$route.path !== '/'"
        type="button"
        @click="handleBack"
        class="bg-red-300 text-white rounded-md px-3 box-border"
      >
        back
      </button>
    </div>
    <div>
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        :class="{
          'text-blue-400': $route.path === link.to,
          'text-black': $route.path !== link.to,
        }"
        class="font-semibold"
        >{{ link.label }}</router-link
      >
    </div>
    <div>
      <button
        v-if="$route.path === '/'"
        type="button"
        @click="handleLogout"
        class="bg-blue-300 text-white rounded-md px-3 box-border"
      >
        logout
      </button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { useRouter } from 'vue-router';
import InstallBanner from './InstallBanner.vue';
import useUserStore from '../stores/user';
import useNetworkStore from '../stores/network';
import { storeToRefs } from 'pinia';

const router = useRouter();

const store = useNetworkStore();
const { isOnline } = storeToRefs(store);

const { getUser: user, setIsLogin } = useUserStore();
const { path } = router.currentRoute.value;
const navLinks = [];

const handleBack = () => {
  router.push('/');
};

const handleLogout = async () => {
  if (user.social.Kakao) {
    Kakao.Auth.logout();
  }

  await setIsLogin(false);
  router.push('/login');
};
</script>
