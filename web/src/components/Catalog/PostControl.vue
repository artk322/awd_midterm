<template>
  <div v-if="data.length">
    <a id="postControl" href data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <i class="icon dots"></i>
    </a>
    <div class="dropdown-menu" aria-labelledby="postControl">
      <a
        v-for="item in data"
        :key="item.name"
        class="dropdown-item"
        @click.prevent="action(item.action)"
      >
        <span>{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostControl',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  methods: {
    action(action) {
      this.$emit('action', {
        action,
      });
    },
  },
};
</script>

<style>
#postControl {
  display: flex;
}

.dropdown-menu {
  background: #ffffff !important;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2) !important;
  border-radius: 2px !important;
  border: none !important;
  padding: 0 !important;
}

.dropdown-item {
  padding: 9px 20px !important;
}

.dropdown-item:hover,
.dropdown-item:active {
  background-color: #252525 !important;
  color: #ffffff !important;
  cursor: pointer;
}
</style>
