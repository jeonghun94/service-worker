<template>
  <div
    v-if="pwa.deferredPrompt"
    v-motion="motionOptions"
    @click="install"
    @mouseover="handleClearTimeout"
    @mouseleave="handleStartTimeout"
    class="absolute top-0 left-0 flex justify-center w-full text-white h-auto p-3 z-10 cursor-pointer"
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
          <button class="text-[#0174DF] font-bold text-lg bg-transparent">
            설치
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import usePwaStore from '../stores/pwa';

export default {
  name: 'App',
  setup() {
    const pwa = usePwaStore();

    // const deferredPrompt = ref(null);
    const timeoutId = ref(null);
    const motionOptions = {
      initial: {
        opacity: 0,
        y: -200,
      },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 150,
          type: 'spring',
          stiffness: 250,
          damping: 25,
          mass: 0.5,
        },
      },
      leave: {
        opacity: 0,
        y: -200,
        transition: {
          delay: 150,
          type: 'spring',
          stiffness: 250,
          damping: 25,
          mass: 0.5,
        },
      },
    };

    const dismiss = () => {
      pwa.setDeferredPrompt(null);
    };

    const install = () => {
      pwa.deferredPrompt.prompt();
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      pwa.setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      pwa.setDeferredPrompt(null);
    };

    const handleStartTimeout = () => {
      timeoutId.value = setTimeout(() => {
        dismiss();
      }, 2000);
    };

    const handleClearTimeout = () => {
      clearTimeout(timeoutId.value);
    };

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      handleStartTimeout();
      console.log(pwa.deferredPrompt);
    });

    onBeforeUnmount(() => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    });

    return {
      motionOptions,
      pwa,

      dismiss,
      install,
      handleClearTimeout,
      handleStartTimeout,
    };
  },
};
</script>
