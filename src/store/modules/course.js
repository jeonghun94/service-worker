/* eslint-disable no-param-reassign */
import axios from 'axios';
import { URL } from '../../constants';

const apiUrl = '/api/class-info';

const filteredClassInfoData = (data) => {
  const today = new Date();
  const yesterday = new Date(today.getTime());
  const tomorrow = new Date(today.getTime());
  yesterday.setDate(yesterday.getDate() - 1);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const groupedData = {
    '전일 수강 목록': [],
    '금일 수강 목록': [],
    '내일 수강 목록': [],
  };

  data.forEach((item) => {
    const startDateString = formatDate(new Date(item.startDate));
    if (startDateString === formatDate(yesterday)) {
      groupedData['전일 수강 목록'].push(item);
    } else if (startDateString === formatDate(today)) {
      groupedData['금일 수강 목록'].push(item);
    } else if (startDateString === formatDate(tomorrow)) {
      groupedData['내일 수강 목록'].push(item);
    }
  });

  return groupedData;
};

const courseState = {
  course: [],
};

const course = {
  namespaced: true,
  state: courseState,
  mutations: {
    SET_COURSE_LIST(state, payload) {
      state.course = payload;
      console.log(state.course);
    },
  },
  actions: {
    setCourseList: async ({ commit }) => {
      const response = await axios.get(URL + apiUrl);
      commit('SET_COURSE_LIST', filteredClassInfoData(response.data));
    },
  },

  getters: {
    getCourseList: (state) => state.course,
  },
};

export default course;
