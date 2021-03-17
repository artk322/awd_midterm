<template>
  <div>
    <Loader v-if="loading" />
    <mapbox
      v-else
      :access-token="token"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v9',
        center: currentMapData.center || center,
        zoom: currentMapData.zoom || zoom,
      }"
      @map-init="initialized"
      @map-load="loaded"
      @map-zoomend="zoomEvent"
      @map-moveend="moveEvent"
    />
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
});

export default {
  name: 'Map',
  components: { Mapbox },
  props: {},
  data: () => ({
    token: process.env.VUE_APP_MAP_TOKEN,
    loading: true,
    zoom: 10,
    center: [51.36827875968106, 51.223267578346395], // oral
    map: null,
  }),
  computed: {
    currentMapData() {
      return this.$store.getters.currentMapData || {};
    },
  },
  async created() {
    if ((this.$route.name == 'post' || this.$route.name == 'edit-post') && this.$route.params.id) {
      await this.$store.dispatch('fetchGeometry', { pid: +this.$route.params.id });
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.commit('clearCurrentMapData');
    this.$store.commit('clearMapData');
    this.$store.commit('clearFeaturesId');
  },
  methods: {
    initialized(map) {
      this.map = map;
      if (this.$route.name == 'create-post' || this.$route.name == 'edit-post') {
        map.addControl(draw);

        map.on('draw.create', this.createPolygon);
        map.on('draw.update', this.updatePolygon);
        map.on('draw.delete', this.deletePolygon);
      }
    },
    createPolygon(e) {
      this.$store.commit('addPolygon', e.features[0]);
    },
    updatePolygon(e) {
      this.$store.commit('updatePolygon', e.features);
    },
    deletePolygon(e) {
      this.$store.commit('deletePolygon', e.features);
    },
    loaded(map) {
      this.zoom = map.getZoom();
      const mapCenter = map.getCenter();
      this.center = [mapCenter.lng, mapCenter.lat];

      const features = this.currentMapData.featureCollection?.features || [];
      this.$store.commit('setMapData', { center: this.center, zoom: this.zoom, features });

      if (Object.keys(this.currentMapData).length && this.$route.name == 'post') {
        map.addSource('maine', {
          type: 'geojson',
          data: this.currentMapData.featureCollection,
        });
        map.addLayer({
          id: 'maine',
          type: 'fill',
          source: 'maine',
          layout: {},
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8,
          },
        });
      } else if (Object.keys(this.currentMapData).length && this.$route.name == 'edit-post') {
        draw.set(this.currentMapData.featureCollection);
      }
    },
    drawFeature(data, bbox) {
      draw.add(data);
      this.map.fitBounds(bbox);
      this.$store.commit('addPolygon', data);
      this.$store.commit('addFeatureId', data.id);
    },
    deleteFeature(feature_id) {
      draw.delete(feature_id);
    },
    zoomEvent(map) {
      this.zoom = map.getZoom();
      if (this.$route.name == 'edit-post' || this.$route.name === 'create-post') {
        this.$store.commit('setMapData', { zoom: this.zoom });
      }
    },
    moveEvent(map) {
      const mapCenter = map.getCenter();
      this.center = [mapCenter.lng, mapCenter.lat];
      if (this.$route.name == 'edit-post' || this.$route.name === 'create-post') {
        this.$store.commit('setMapData', { center: this.center });
      }
    },
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 350px;
  border-radius: 5px;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib,
.mapboxgl-ctrl-logo {
  display: none !important;
}
</style>
