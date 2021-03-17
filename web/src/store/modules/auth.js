/* eslint-disable no-unused-vars */
import axios from 'axios';
const api = `${window.location.origin}/api/`;
import signin_ds_challenge from '../../utils/signin_ds_challenge.js';

export default {
  state: {
    userData: null,
    eds_iin: null,
    signUpAction: 'VerifyNCA',
  },
  getters: {
    userData: state => state.userData,
    eds_iin: state => state.eds_iin,
    signUpAction: state => state.signUpAction,
  },
  mutations: {
    setUserData(state, payload) {
      if (payload) {
        state.userData = payload.user;
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    },
    clearUserData(state) {
      state.userData = {};
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
    },
    setSignUpAction(state, action) {
      state.signUpAction = action || 'VerifyNCA';
    },
    setIIN(state, eds_iin) {
      state.eds_iin = eds_iin;
    },
    clearIIN(state) {
      state.iin = null;
    },
  },
  actions: {
    async registerUser({ commit }, data) {
      await axios
        .post(api + 'register', data)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async login({ commit }, payload) {
      await axios
        .post(api + 'login', payload)
        .then(res => {
          localStorage.setItem('jwt', res.data.accessToken);
          commit('setUserData', res.data);
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async logout({ commit }) {
      await axios
        .post(api + 'logout')
        .then(res => {
          commit('clearUserData');
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async updateUser({ commit }, payload) {
      await axios
        .put(api + 'updateUser', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(res => {
          localStorage.setItem('jwt', res.data.accessToken);
          commit('setUserData', res.data);
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async deleteUser({ commit }, payload) {
      await axios
        .post(api + 'deleteUser', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async verifyEmail({ commit }, payload) {
      await axios
        .post(api + 'verifyEmail', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async sendRecoveryEmail({ commit }, payload) {
      await axios
        .post(api + 'sendRecoveryEmail', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async resetPassword({ commit }, payload) {
      await axios
        .put(api + 'resetPassword', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async signup_by_digital_signature({ commit }) {
      let ncalayer;
      try {
        ncalayer = await ws_connect('wss://127.0.0.1:13579');
      } catch (_err) {
        return commit('setMessage', { type: 'error', message: _err.message });
      }
      try {
        const _startup_msg = await ws_recv_message(ncalayer);
        const challenge = await signin_ds_challenge();
        ncalayer.send(
          JSON.stringify({
            module: 'kz.gov.pki.knca.commonUtils',
            method: 'signXml',
            args: [
              'PKCS12', // storageType
              'AUTH', // keyType
              challenge,
              '',
              '',
            ],
          })
        );
        const signxml_result = JSON.parse(await ws_recv_message(ncalayer));
        if (signxml_result.code != 200) {
          if (signxml_result.message == 'action.canceled') {
            return commit('setMessage', { message: 'Отмена' });
          }
          return commit('setMessage', { type: 'error', message: signxml_result.message });
        }

        await axios
          .post(api + 'verifyEDS', { ds_challenge: signxml_result.responseObject })
          .then(res => {
            commit('setSignUpAction', 'UserData');
            commit('setIIN', res.data.iin);
          })
          .catch(err => {
            commit('setMessage', { type: 'error', message: err.response.data.message });
          });
      } catch (error) {
        return commit('setMessage', { type: 'error', message: error.message });
      } finally {
        ncalayer.close();
      }
    },
  },
};

function ws_connect(...args) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(...args);
    ws.onerror = on_error;
    ws.onopen = on_open;
    function on_open() {
      cleanup();
      resolve(ws);
    }
    function on_error(evt) {
      cleanup();
      reject(evt);
    }
    function cleanup() {
      ws.onopen = null;
      ws.onerror = null;
    }
  });
}

function ws_recv_message(ws) {
  return new Promise((resolve, reject) => {
    ws.addEventListener('error', on_error);
    ws.addEventListener('message', on_message);
    function on_message(evt) {
      cleanup();
      resolve(evt.data);
    }
    function on_error(evt) {
      cleanup();
      reject(evt);
    }
    function cleanup() {
      ws.removeEventListener('error', on_error);
      ws.removeEventListener('message', on_message);
    }
  });
}
