<template>
  <div>
    <div class="formWithSupText">
      <input
        id="postPrice"
        v-model.trim="feature_id_input"
        type="text"
        class="post_form-control w-25"
        autocomplete="off"
        @keydown.enter.prevent="checkFeatureId(feature_id_input)"
      />
      <span class="post_form-suptext">кад. номер</span>
      <span v-if="!$v.feature_id_input.numeric" class="invalid">
        Только цифры
      </span>
      <span v-else-if="!$v.feature_id_input.minLength" class="invalid">
        Не меньше 11
      </span>
      <span v-else-if="!$v.feature_id_input.maxLength" class="invalid">
        Не больше 11
      </span>
    </div>
    <div v-if="features_id.length" class="featureId-container">
      <div v-for="id in features_id" :key="id" class="featureId-item">
        <span class="featureId">
          {{ id }}
          <button
            type="button"
            class="removeFeature"
            aria-label="Close"
            @click="removeFromFeatures(id)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </span>
      </div>
    </div>
    <Map ref="map" class="mt-3" />
  </div>
</template>

<script>
import Map from '@/components/app/Map.vue';
import { mapGetters } from 'vuex';
import { required, maxLength, numeric, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  name: 'FormMap',
  components: { Map },
  data: () => ({
    feature_id_input: '',
  }),
  validations: {
    mapData: {
      features: {
        required,
      },
    },
    feature_id_input: {
      minLength: minLength(11),
      maxLength: maxLength(11),
      numeric,
    },
  },
  computed: {
    ...mapGetters(['mapData', 'features_id']),
  },
  destroyed() {
    this.$store.commit('clearFeaturesId');
  },
  methods: {
    async checkFeatureId(feature_id) {
      if (this.$v.feature_id_input.$invalid) {
        this.$v.feature_id_input.$touch();
        return;
      }

      await axios
        .get(`${process.env.VUE_APP_EBATYS_URL}/api/geometry`, {
          params: {
            feature_id,
            collection: 'land',
          },
        })
        .then(({ data }) => {
          const bbox = [
            [data.bbox[0], data.bbox[1]],
            [data.bbox[2], data.bbox[3]],
          ];

          const payload = {
            id: feature_id,
            type: 'Feature',
            properties: {},
            geometry: {
              type: data.type,
              coordinates: data.coordinates,
            },
          };
          if (!this.features_id.some(e => e === feature_id)) {
            this.$refs.map.drawFeature(payload, bbox);
          }
        })
        .catch(() => {
          this.$store.commit('setMessage', { type: 'error', message: 'Геометрия не найдена' });
        })
        .finally(() => {
          this.feature_id_input = '';
        });
    },
    removeFromFeatures(id) {
      this.$refs.map.deleteFeature(id);
      this.$store.commit('deletePolygon', [{ id }]);
    },
  },
};
</script>

<style>
.featureId-container {
  display: flex;
  margin: 5px -10px;
  flex-wrap: wrap;
}

.featureId-item {
  padding: 10px;
}

.featureId {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 8px;
  border: 1px solid #c1c1c1;
  background-color: #ebebeb;
  border-radius: 25px;
  color: #555555;
  justify-content: center;
}

.removeFeature {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  padding: 0;
  background-color: transparent;
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
}

.removeFeature:hover {
  opacity: 0.7;
  color: #000;
}
</style>
