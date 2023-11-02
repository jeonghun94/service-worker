/* eslint-disable no-param-reassign */
const userState = {
  user: {
    name: '이름',
    age: 0,
  },
};

const user = {
  namespaced: true,
  state: userState,
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit('SET_USER', payload);
    },
  },
  getters: {
    getUser: (state) => state.user,
  },
};

export default user;
