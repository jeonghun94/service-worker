import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: '이름',
      age: 0,
      isLogin: false,
      social: {
        kakao: false,
        naver: false,
      },
    },
  }),
  actions: {
    setIsLogin(social) {
      this.user.isLogin = !this.user.isLogin;
      this.user.social[social] = !this.user.social[social];
    },
  },
  getters: {
    getUser: (state) => state.user,
    isLogin: (state) => state.user.isLogin,
  },
  persist: {
    enabled: true,
    clone: true,
  },
});

export default useUserStore;
