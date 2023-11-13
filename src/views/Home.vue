<template>
  <LoginForm v-if="!isLogin" />
  <CourseList v-else />
</template>

<script>
import { computed, watch } from 'vue';
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
    console.log(isLogin, 'isLogin');

    watch(isLogin, (newVal) => {
      console.log(newVal, 'newVal');
    });

    return {
      isLogin,
    };
  },
};
</script>
