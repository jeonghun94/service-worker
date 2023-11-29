<template>
  <CourseList />
</template>

<script>
import { useRouter } from 'vue-router';
import CourseList from '../components/course/CourseList.vue';
import useUserStore from '../stores/user';

export default {
  name: 'HomeVue',
  components: {
    CourseList,
  },

  setup() {
    const { getUser: user } = useUserStore();
    const router = useRouter();

    if (!user.isLogin) {
      console.log('user.isLogin');
      router.push('/login');
    }
  },
};
</script>
