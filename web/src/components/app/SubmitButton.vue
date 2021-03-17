<template>
  <button :class="buttonClass" :disabled="loading || disableFlag">
    <div
      v-if="loading"
      class="spinner-border"
      style="width: 1.2rem; height: 1.2rem; font-size: 10px;"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
    <span v-else>{{ buttonLabel }}</span>
  </button>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    loading: {
      type: Boolean,
    },
    buttonLabel: {
      type: String,
      default: 'Отправить',
    },
    buttonClass: {
      type: String,
      default: 'btn btn-warning w-100',
    },
    disableFlag: {
      type: Boolean,
    },
  },
};
</script>
