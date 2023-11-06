<template>
  <div
    class="border absolute top-0 w-full box-border left-0 m-0 p-0 flex justify-center gap-3"
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
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NavBar',

  setup() {
    const router = useRouter();
    const { path } = router.currentRoute.value;

    const navLinks = [
      { to: '/', label: 'Home' },
      { to: '/indexed-db', label: 'IndexedDB' },
      { to: '/service-worker', label: 'ServiceWorker' },
      { to: '/vuex', label: 'Vuex' },
    ];

    return {
      router,
      path,
      navLinks,
    };
  },
};
</script>
