<template>
  <div>
    <form>
      <div class="form-group">
        <label for="name">Имя:</label>
        <div v-if="editable" class="formWithSupText">
          <input
            id="name"
            v-model.trim="localUserData.name"
            type="text"
            class="post_form-control"
            autocomplete="off"
          />
        </div>
        <div v-else class="userData">
          <span>{{ userData.name }}</span>
        </div>
      </div>
      <div class="form-group">
        <label for="email">E-mail:</label>
        <div v-if="editable" class="formWithSupText">
          <input
            id="email"
            v-model.trim="localUserData.email"
            type="text"
            class="post_form-control"
            autocomplete="off"
          />
        </div>
        <div v-else class="userData">
          <span>{{ userData.email }}</span>
        </div>
      </div>
      <div class="form-group">
        <label for="phone_number">Номер телефона:</label>
        <div v-if="editable" class="formWithSupText">
          <input
            id="phone_number"
            v-model.trim="localUserData.phone_number"
            type="text"
            class="post_form-control required"
            autocomplete="off"
          />
        </div>
        <div v-else class="userData">
          <span>{{ userData.phone_number }}</span>
        </div>
      </div>
      <hr v-if="editable" />
      <div v-if="editable" class="form-group">Сменить пароль</div>
      <div v-if="editable" class="form-group">
        <label for="password">Пароль:</label>
        <div class="formWithSupText">
          <input
            id="password"
            v-model.trim="password"
            type="password"
            class="post_form-control required"
            autocomplete="off"
          />
        </div>
      </div>
      <div v-if="editable" class="form-group">
        <label for="repeatPassword">Повторите пароль:</label>
        <div class="formWithSupText">
          <input
            id="repeatPassword"
            v-model.trim="repeatPassword"
            type="password"
            class="post_form-control required"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="form-group">
        <label>Дата регистрации:</label>
        <div class="userData">
          <span>{{ userData.registration_date | date }}</span>
        </div>
      </div>
      <div class="row justify-content-between mt-5 mx-0">
        <div class="form-group-lg-2 form-group-md-5 form-group-sm-12 form-group-12">
          <button class="btn btn-submit w-100" @click.prevent="submitHandler">
            <span v-if="editable">Сохранить</span>
            <span v-else>Редактировать</span>
          </button>
        </div>
        <div
          class="form-group-lg-2 form-group-md-5 form-group-sm-12 form-group-12 mt-lg-0 mt-md-0 mt-3"
        >
          <button v-if="editable" class="btn btn-delete w-100" @click.prevent="editable = false">
            <span>Отмена</span>
          </button>
          <button v-else class="btn btn-delete w-100" @click.prevent="deleteUser">
            <span>Удалить пользователя</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data: () => ({
    localUserData: {},
    editable: false,
    password: '',
    repeatPassword: '',
  }),
  computed: {
    userData() {
      return this.$store.getters.userData || {};
    },
    message() {
      return this.$store.getters.message;
    },
  },
  async mounted() {
    this.localUserData = {
      name: this.userData.name,
      email: this.userData.email,
      phone_number: this.userData.phone_number,
      uid: this.userData.uid,
    };
  },
  methods: {
    async submitHandler() {
      if (this.editable) {
        const userData = {
          ...this.localUserData,
        };
        await this.$store.dispatch('updateUser', userData);
        this.editable = false;
      } else this.editable = true;
    },
    async deleteUser() {
      const answer = confirm('Удалить участок?');
      if (answer) {
        await this.$store.dispatch('deleteUser', { uid: this.userData.uid });
        await this.$store.commit('clearUserData');
        if (this.message.type !== 'error') {
          this.$router.push('/login');
        }
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  display: flex;
  align-items: center;
}
.post_form-control {
  width: 100%;
}
label {
  margin-right: 0.5rem;
  margin-bottom: 0;
}
</style>
