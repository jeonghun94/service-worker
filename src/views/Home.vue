<template>
  <slot> <NavBar /> </slot>
  <div class="w-full flex justify-center">
    <a href="#">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
  </div>
  <HelloWorld />
</template>

<script>
import NavBar from '../components/NavBar.vue';
import HelloWorld from '../components/HelloWorld.vue';

export default {
  name: 'HomeVue',
  components: {
    HelloWorld,
    NavBar,
  },
};
</script>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
