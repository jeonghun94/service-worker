<template>
  <div
    class="absolute top-0 left-0 w-full flex justify-between items-center gap-3 py-2 px-3 border-b bg-white"
  >
    <div>
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
      // { to: '/index-db', label: 'IndexedDB' },
    ];

    const handleBack = () => {
      router.push('/');
    };

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
      handleBack,
    };
  },
};
</script>
