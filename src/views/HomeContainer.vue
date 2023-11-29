<template>
  <CourseList />
</template>

<script setup>
import { useRouter } from 'vue-router';
import CourseList from '../components/CourseList.vue';
import useUserStore from '../stores/user';

const { getUser: user } = useUserStore();
const router = useRouter();

if (!user.isLogin) {
  router.push('/login');
}
</script>
