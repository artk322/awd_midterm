/* eslint-disable no-unused-vars */
import axios from 'axios';
import { categoriesTypes, filterCategories, filterStatus, controls } from '../ui_post.js';
const api = `${window.location.origin}/api/`;

export default {
  state: {
    posts: [],
    userPosts: [],
    searchString: '',
    currentPost: null,
    currentMapData: null,
    selected_category: 'all',
  },
  getters: {
    posts: state => state.posts,
    currentPost: state => state.currentPost,
    userPosts: state => state.userPosts,
    searchString: state => state.searchString,
    hots: state => state.posts.filter(p => p.hot),
    currentMapData: state => state.currentMapData,
    categoriesTypes: _ => categoriesTypes,
    selected_category: state => state.selected_category,
    filterCategories: _ => filterCategories,
    filterStatus: _ => filterStatus,
    controls: _ => admin_control =>
      controls.filter(control => {
        if (admin_control === true) {
          return control;
        } else {
          return control.admin_control === false;
        }
      }),
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setUserPosts(state, payload) {
      state.userPosts = payload;
    },
    clearUserPosts(state) {
      state.userPosts = [];
    },
    toSearch(state, payload) {
      state.searchString = payload;
    },
    setCurrentPost(state, payload) {
      if (Object.keys(payload).length) {
        state.currentPost = payload;
      }
    },
    clearCurrentPost(state) {
      state.currentPost = null;
    },
    setCurrentMapData(state, payload) {
      state.currentMapData = payload;
    },
    clearCurrentMapData(state) {
      state.currentMapData = null;
    },
    updatePostStatus(state, payload) {
      if (state.posts.length) {
        state.posts.find(p => p.pid == payload.pid).status = payload.status;
      }
      state.currentPost.status = payload.status;
    },
    select_category(state, category) {
      state.selected_category = category || 'all';
    },
  },
  actions: {
    async fetchAllPosts({ commit }) {
      await axios
        .get(api + 'fetchAllPosts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setPosts', response.data.posts);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async fetchApprovedPosts({ commit }) {
      await axios
        .get(api + 'fetchApprovedPosts')
        .then(response => {
          commit('setPosts', response.data.posts);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async fetchPostByPid({ commit }, payload) {
      await axios
        .post(api + 'fetchPostByPid', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setCurrentPost', response.data);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async fetchUserPosts({ commit }) {
      await axios
        .get(api + 'fetchUserPosts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setUserPosts', response.data.posts);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async fetchGeometry({ commit }, payload) {
      await axios
        .post(api + 'fetchGeometry', payload)
        .then(response => {
          commit('setCurrentMapData', response.data);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async createPost({ commit }, payload) {
      await axios
        .post(api + 'createPost', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async updatePost({ commit }, payload) {
      await axios
        .put(api + 'updatePost', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async deletePost({ commit }, payload) {
      await axios
        .post(api + 'deletePost', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async updatePostStatus({ commit }, payload) {
      await axios
        .put(api + 'updatePostStatus', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('updatePostStatus', payload);
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
  },
};
