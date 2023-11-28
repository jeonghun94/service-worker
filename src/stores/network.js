import { defineStore } from 'pinia';

const useNetworkStore = defineStore('network', {
  state: () => ({ isOnline: true }),
  actions: {
    setIsOnline(e) {
      this.isOnline = e;
    },
  },
  getters: {
    getIsOnline: (state) => state.isOnline,
  },
  persist: {
    enabled: true,
    storage: window.sessionStorage,
  },
});

export default useNetworkStore;
