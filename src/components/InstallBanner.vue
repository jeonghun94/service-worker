<template>
  <div
    v-if="deferredPrompt"
    v-motion="motionOptions"
    @click="install"
    @mouseover="handleClearTimeout"
    @mouseleave="handleStartTimeout"
    class="fixed top-3 w-2/3 max-w-2xl inset-x-0 mx-auto text-white z-10 cursor-pointer"
  >
    <div
      class="w-full px-5 py-3 box-border flex flex-col items-start bg-gray-950 bg-opacity-90 rounded-md"
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

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';

const deferredPrompt = ref(null);
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
  deferredPrompt.value = null;
};

const install = () => {
  deferredPrompt.value.prompt();
};

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
};

const handleAppInstalled = () => {
  deferredPrompt.value = null;
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
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});
</script>
