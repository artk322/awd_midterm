// import axios from 'axios';
// const api = `${window.location.origin}/api/`;

export default {
  state: {
    mapData: {
      features: [],
      zoom: '',
      center: [],
    },
    features_id: [],
  },
  getters: {
    mapData: state => state.mapData,
    features_id: state => state.features_id,
  },
  mutations: {
    setMapData(state, payload) {
      const { zoom, center, features } = payload;
      if (zoom) {
        state.mapData.zoom = zoom;
      }
      if (center) {
        state.mapData.center = center;
      }
      if (features) {
        state.mapData.features = features;
      }
    },
    clearMapData(state) {
      state.mapData = {
        features: [],
        zoom: '',
        center: [],
      };
    },
    addPolygon(state, payload) {
      state.mapData.features.push(payload);
    },
    updatePolygon(state, payload) {
      state.mapData.features.map((it, idx) => {
        payload.map(p => {
          if (it.id === p.id) {
            state.mapData.features.splice(idx, 1, p);
          }
        });
      });
    },
    deletePolygon(state, payload) {
      state.mapData.features.map((it, idx) => {
        payload.map(p => {
          if (it.id === p.id) {
            state.mapData.features.splice(idx, 1);
          }
        });
      });
      state.features_id.map((it, idx) => {
        payload.map(p => {
          if (it === p.id) {
            state.features_id.splice(idx, 1);
          }
        });
      });
    },
    addFeatureId(state, payload) {
      if (payload) {
        state.features_id.push(payload);
      }
    },
    setFeaturesId(state, payload) {
      state.features_id = payload;
    },
    clearFeaturesId(state) {
      state.features_id = [];
    },
  },
  actions: {},
};
