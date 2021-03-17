<template>
  <div class="app_loader">
    <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped>
.app_loader {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
