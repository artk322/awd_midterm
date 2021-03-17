<template>
  <form @submit.prevent="submitHandler">
    <h3 class="text-center">Регистрация с ЭЦП</h3>
    <div class="form-group">
      <label for="email" class="required">Email</label>
      <input id="email" v-model="email" type="email" class="form-control" />
      <div v-if="$v.email.$dirty && !$v.email.required" class="invalid-feedback">
        Заполните поле
      </div>
      <div v-else-if="$v.email.$dirty && !$v.email.email" class="invalid-feedback">
        Неккоректный email
      </div>
    </div>
    <div class="form-group">
      <label class="required" for="password">Пароль</label>
      <input id="password" v-model="password" type="password" class="form-control" />
      <div v-if="$v.password.$dirty && !$v.password.required" class="invalid-feedback">
        Заполните поле
      </div>
      <div v-else-if="$v.password.$dirty && !$v.password.minLength" class="invalid-feedback">
        Неккоректный пароль, минимум 6 симбволов
      </div>
    </div>
    <div class="form-group">
      <label class="required" for="repeatPassword">Повторите пароль</label>
      <input id="repeatPassword" v-model="repeatPassword" type="password" class="form-control" />
      <div v-if="$v.repeatPassword.$dirty && !$v.repeatPassword.required" class="invalid-feedback">
        Заполните поле
      </div>
      <div
        v-else-if="$v.repeatPassword.$dirty && !$v.repeatPassword.sameAsPassword"
        class="invalid-feedback"
      >
        Пароли не совпадают
      </div>
    </div>
    <div class="form-group">
      <label class="required" for="name">Имя</label>
      <input id="name" v-model="name" type="text" class="form-control" />
      <div v-if="$v.name.$dirty && !$v.name.required" class="invalid-feedback">
        Заполните поле
      </div>
      <div v-else-if="$v.name.$dirty && !$v.name.minLength" class="invalid-feedback">
        Не больше 3 симбволов
      </div>
      <div v-else-if="$v.name.$dirty && !$v.name.maxLength" class="invalid-feedback">
        Не больше 25 симбволов
      </div>
    </div>
    <div class="form-group">
      <label class="required" for="phone_number">Телефон</label>
      <input id="phone_number" v-model="phone_number" type="tel" class="form-control" />
      <div v-if="$v.phone_number.$dirty && !$v.phone_number.required" class="invalid-feedback">
        Заполните поле
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-12">
        <SubmitButton :loading="loading" button-label="Отправить" />
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
import { email, required, maxLength, minLength, sameAs } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  name: 'UserData',
  data: () => ({
    email: '',
    name: '',
    phone_number: '',
    password: '',
    repeatPassword: '',
    loading: false,
  }),
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(25),
    },
    phone_number: {
      required,
    },
  },
  computed: {
    ...mapGetters(['message', 'eds_iin']),
  },
  destroyed() {
    this.$store.commit('clearIIN');
    this.$store.commit('setSignUpAction', 'VerifyNCA');
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const payload = {
        email: this.email,
        password: this.password,
        name: this.name,
        phone_number: this.phone_number,
        iin: this.eds_iin,
      };
      this.loading = true;
      await this.$store.dispatch('registerUser', payload);
      if (this.message.type !== 'error') {
        this.$router.push('/login');
      }
      this.loading = false;
    },
  },
};
</script>

<style>
.invalid-feedback {
  display: block;
}
</style>
