<template>
  <form @submit.prevent="submitHandler">
    <h3 class="text-center">Сросить пароль</h3>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" class="form-control" />
      <span v-if="$v.email.$dirty && !$v.email.required" class="invalid ml-0">
        Заполните это поле
      </span>
      <span v-else-if="$v.email.$dirty && !$v.email.email" class="invalid ml-0">
        Введите email
      </span>
    </div>
    <div class="mt-4">
      <div class="row justify-content-between">
        <div class="col-lg-12">
          <SubmitButton :loading="loading" button-label="Отправить" :disable-flag="timeout" />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-4">
          <span>
            <router-link to="/signup" class="link">Регистрация</router-link>
          </span>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-4 text-right">
          <router-link to="/login" class="link">Войти</router-link>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators';

export default {
  name: 'SendRecoveryMessage',
  data: () => ({
    loading: false,
    timeout: false,
    email: '',
    timerCount: 30,
  }),
  validations: {
    email: {
      email,
      required,
    },
  },
  computed: {},
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.loading = true;
      await this.$store.dispatch('sendRecoveryEmail', { email: this.email });
      this.loading = false;
    },
  },
};
</script>
