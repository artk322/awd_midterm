<template>
  <form @submit.prevent="submitHandler">
    <h3 class="text-center">Регистрация с ЭЦП</h3>
    <div class="row mt-4">
      <div class="col-lg-12">
        <SubmitButton :loading="loading" button-label="Использовать ЭЦП" />
      </div>
      <div class="col-lg-12 text-center mt-4">
        <span>
          Уже есть аккаунт?
          <router-link to="/login" class="link">
            Войти
          </router-link>
        </span>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'VerifyNCA',
  data: () => ({
    loading: false,
  }),
  methods: {
    async submitHandler() {
      this.loading = true;
      await this.$store.dispatch('signup_by_digital_signature');
      this.loading = false;
    },
  },
};
</script>

<style></style>
