<template>
  <NavBar />
  <div class="w-full flex justify-center">
    <a href="#">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>

    <h1 class="text-black">{{ user.name }}</h1>
    <h1 class="text-black">{{ user.age }}</h1>
  </div>

  <HelloWorld />
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NavBar from '../components/NavBar.vue';
import HelloWorld from '../components/HelloWorld.vue';

export default {
  name: 'HomeVue',
  components: {
    HelloWorld,
    NavBar,
  },

  setup() {
    const { getters, dispatch } = useStore();
    const user = computed(() => getters['user/getUser']);

    onMounted(async () => {
      await dispatch('user/setUser', { name: 'hun', age: 30 });
    });
    return { user };
  },
};
</script>
