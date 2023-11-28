import { defineStore } from 'pinia';

const usePwaStore = defineStore('pwa', {
  state: () => ({ deferredPrompt: null }),
  actions: {
    setDeferredPrompt(e) {
      this.deferredPrompt = e;
    },

    resetDeferredPrompt() {
      this.deferredPrompt = null;
    },
  },
  persist: {
    enabled: true,
  },
});

export default usePwaStore;
