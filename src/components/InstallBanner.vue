<template>
  <div
    v-if="!isInstallable"
    v-motion
    :initial="{
      opacity: 0,
      y: -200,
    }"
    :enter="{
      opacity: 1,
      y: 0,
      transition: {
        delay: 150,
        type: 'spring',
        stiffness: 250,
        damping: 25,
        mass: 0.5,
      },
    }"
    class="absolute top-7 left-0 flex justify-center w-full text-white h-auto p-3 z-10"
  >
    <div
      class="w-2/3 max-w-md px-5 py-3 box-border flex flex-col items-start bg-gray-950 bg-opacity-90 rounded-md"
    >
      <div class="w-full flex gap-3 text-left">
        <div class="w-4/5">
          <p class="font-bold text-lg">바로가기 아이콘 추가</p>
          <p class="text-sm">
            홈(바탕) 화면에 바로가기를<br />
            추가하시겠습니까?
          </p>
        </div>
        <div class="w-1/5 flex justify-center items-center">
          <button
            id="install-button"
            class="text-[#0174DF] font-bold text-lg bg-transparent"
          >
            설치
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'InstallBanner',
  setup() {
    const isInstallable = ref(false);

    onMounted(() => {
      isInstallable.value = Boolean(localStorage.getItem('isInstallable'));
      if (!isInstallable.value) {
        setTimeout(() => {
          isInstallable.value = true;
        }, 3000);
      }
    });

    return {
      isInstallable,
    };
  },
};
</script>
