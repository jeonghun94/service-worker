/* eslint-disable no-param-reassign */
const userState = {
  user: {
    name: '이름',
    age: 0,
    isLogin: false,
  },
};

const user = {
  namespaced: true,
  state: userState,
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_IS_LOGIN(state) {
      console.log('SET_IS_LOGIN');
      state.user.isLogin = !state.user.isLogin;
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit('SET_USER', payload);
    },
    setIsLogin({ commit }) {
      commit('SET_IS_LOGIN');
    },
  },
  getters: {
    getUser: (state) => state.user,
    isLogin: (state) => state.user.isLogin,
  },
};

export default user;
