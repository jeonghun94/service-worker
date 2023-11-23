<template>
  <LoginForm v-if="!isLogin" />
  <CourseList v-else />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import LoginForm from '../components/LoginForm.vue';
import CourseList from '../components/course/CourseList.vue';

export default {
  name: 'HomeVue',
  components: {
    LoginForm,
    CourseList,
  },

  setup() {
    const { getters } = useStore();
    const isLogin = computed(() => getters['user/isLogin']);

    return {
      isLogin,
    };
  },
};
</script>
