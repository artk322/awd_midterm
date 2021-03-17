/* eslint-disable no-unused-vars */
import axios from 'axios';
import { tabs } from '../ui_models.js';
const api = `${window.location.origin}/api/`;

export default {
  state: {
    currentTab: 'UserSettings',
    users: null,
  },
  getters: {
    tabs: _ => is_admin =>
      tabs.filter(tab => {
        if (is_admin === true) {
          return tab;
        } else {
          return tab.tab_admin === false;
        }
      }),
    currentTab: state => state.currentTab,
    users: state => state.users,
  },
  mutations: {
    switchTab(state, tab) {
      state.currentTab = tab;
    },
    setUsers(state, payload) {
      state.users = payload;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      const jwt = localStorage.getItem('jwt') || null;
      await axios
        .get(api + 'users', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then(response => {
          commit('setUsers', response.data.users);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
  },
};
