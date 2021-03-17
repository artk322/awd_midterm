<template>
  <div class="row justify-content-center mt-5 mx-0">
    <div class="col-lg-5 col-md-8 col-sm-10 col-12">
      <div class="jumbotron bg-white py-4">
        <form @submit.prevent="submitHandler">
          <h3 class="text-center">Логин</h3>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input id="password" v-model="password" type="password" class="form-control" required />
          </div>
          <div class="mt-4">
            <div class="row justify-content-between">
              <div class="col-lg-12">
                <SubmitButton :loading="loading" button-label="Войти" />
              </div>
              <div class="col-lg-6 mt-4">
                <span>
                  <router-link to="/signup" class="link">
                    Регистрация
                  </router-link>
                </span>
              </div>
              <div class="col-lg-6 mt-4 text-right">
                <router-link to="/forgot-password" class="link">Забыли пароль?</router-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: '',
    password: '',
    loading: false,
  }),
  computed: {
    message() {
      return this.$store.getters.message;
    },
  },
  methods: {
    async submitHandler() {
      const formData = {
        email: this.email,
        password: this.password,
      };
      this.loading = true;
      await this.$store.dispatch('login', formData);
      if (this.message.type !== 'error') {
        this.$router.push('/catalog');
      }
      this.loading = false;
    },
  },
};
</script>
