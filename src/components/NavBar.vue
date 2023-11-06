<template>
  <div
    class="border absolute top-0 w-full box-border left-0 m-0 p-0 flex justify-center gap-3"
  >
    <router-link
      to="/"
      class="text-inherit"
      :class="{
        'text-inherit text-blue-500': $route.path === '/',
      }"
      >Home</router-link
    >
    <router-link
      to="/indexed-db"
      class="text-inherit"
      :class="{
        'text-inherit text-blue-500': $route.path === '/indexed-db',
      }"
      >IndexedDB</router-link
    >
    <router-link
      to="/service-worker"
      class="text-inherit"
      :class="{
        'text-inherit text-blue-500': $route.path === '/service-worker',
      }"
      >ServiceWorker</router-link
    >
    <router-link
      to="/vuex"
      class="text-inherit"
      :class="{ 'text-inherit text-blue-500': $route.path === '/vuex' }"
      >Vuex</router-link
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
    return {
      router,
      path,
    };
  },
};
</script>
