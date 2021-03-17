<template>
  <div class="container">
    <Loader v-if="loading" />
    <div v-else>
      <h1>Токен получен</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Verify',
  data: () => ({
    loading: true,
  }),
  computed: {
    message() {
      return this.$store.getters.message;
    },
  },
  async created() {
    await this.$store.dispatch('verifyEmail', { emailToken: this.$route.params.token });
    if (this.message.type !== 'error') {
      this.$router.push('/login');
    }
    this.loading = false;
  },
};
</script>

<style></style>
