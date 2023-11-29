<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-300 bg-opacity-50"
  >
    <div class="text-white text-2xl">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
};
</script>
