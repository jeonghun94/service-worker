<template>
  <div
    class="absolute top-0 left-0 w-full flex justify-center items-center gap-3 py-2 px-3 border-b bg-white"
  >
    <router-link
      v-for="link in navLinks"
      :key="link.to"
      :to="link.to"
      :class="{
        'text-blue-500': $route.path === link.to,
        'text-black': $route.path !== link.to,
      }"
      >{{ link.label }}</router-link
    >
  </div>
  <div class="absolute top-0 right-0 pr-7 py-2">
    <button
      type="button"
      @click="handleLogout"
      class="bg-blue-300 text-white rounded-md px-3 box-border"
    >
      logout
    </button>
  </div>
</template>

<script>
/* eslint-disable */
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter();
    const { path } = router.currentRoute.value;
    const { dispatch, getters } = useStore();
    const user = getters['user/getUser'];

    const navLinks = [
      { to: '/', label: 'Home' },
      { to: '/index-db', label: 'IndexedDB' },
    ];

    const handleLogout = async () => {
      await dispatch('user/setIsLogin', false);
      if (user.social.Kakao) {
        Kakao.Auth.logout();
      }
    };

    return {
      navLinks,
      router,
      path,

      handleLogout,
    };
  },
};
</script>
