<template>
  <slot> <NavBar /> </slot>
  <h1>About</h1>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: 'AboutVue',
  components: {
    NavBar,
  },
};
</script>
