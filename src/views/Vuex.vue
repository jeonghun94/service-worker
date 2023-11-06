<template>
  <NavBar />
  <div class="w-full flex justify-center">
    <h1 class="text-black">{{ user.name }}</h1>
    <h1 class="text-black">{{ user.age }}</h1>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'vuex-vue',
  components: { NavBar },
  setup() {
    const { getters, dispatch } = useStore();
    const user = computed(() => getters['user/getUser']);

    onMounted(async () => {
      await dispatch('user/setUser', { name: 'jhun', age: 30 });
    });
    return { user };
  },
};
</script>
