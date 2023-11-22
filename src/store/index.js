import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './modules/user';
import course from './modules/course';

export default createStore({
  modules: {
    user,
    course,
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'course'],
      storage: window.sessionStorage,
    }),
  ],
});
