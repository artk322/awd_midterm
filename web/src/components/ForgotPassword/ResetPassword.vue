<template>
  <form @submit.prevent="submitHandler">
    <h3 class="text-center">Сросить пароль</h3>
    <div class="form-group">
      <label class="required" for="password">Пароль</label>
      <input id="password" v-model="password" type="password" class="form-control" />
    </div>
    <div class="form-group">
      <label class="required" for="repeatPassword">Повторите пароль</label>
      <input id="repeatPassword" v-model="repeatPassword" type="password" class="form-control" />
      <span v-if="$v.password.$dirty && !$v.password.required" class="invalid ml-0">
        Заполните поля
      </span>
      <span v-else-if="$v.password.$dirty && !$v.password.minLength" class="invalid ml-0">
        Не меньше 6 симбволов
      </span>
      <span
        v-else-if="$v.repeatPassword.$dirty && !$v.repeatPassword.sameAsPassword"
        class="invalid ml-0"
      >
        Пароли должны совпадать
      </span>
    </div>
    <div class="mt-4">
      <div class="row justify-content-between">
        <div class="col-lg-12">
          <SubmitButton :loading="loading" button-label="Поменять пароль" />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-4">
          <span>
            <router-link to="/signup" class="link">
              Регистрация
            </router-link>
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
import { required, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  data: () => ({
    loading: false,
    password: '',
    repeatPassword: '',
  }),
  validations: {
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
  computed: {
    message() {
      return this.$store.getters.message;
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const paylaod = {
        emailToken: this.$route.query.token,
        password: this.password,
      };
      this.loading = true;
      await this.$store.dispatch('resetPassword', paylaod);
      this.loading = false;
      if (this.message.type !== 'error') {
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style></style>
