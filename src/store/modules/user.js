/* eslint-disable no-param-reassign */
const userState = {
  user: {
    name: '이름',
    age: 0,
    isLogin: false,
    social: {
      kakao: false,
      naver: false,
    },
  },
};

const user = {
  namespaced: true,
  state: userState,
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_IS_LOGIN(state, social) {
      state.user.isLogin = !state.user.isLogin;
      state.user.social[social] = !state.user.social[social];
    },
  },
  actions: {
    setUser({ commit }) {
      commit('SET_USER');
    },
    setIsLogin({ commit }, social) {
      commit('SET_IS_LOGIN', social);
    },
  },
  getters: {
    getUser: (state) => state.user,
    isLogin: (state) => state.user.isLogin,
  },
};

export default user;
