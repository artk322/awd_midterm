<template>
  <Loader v-if="loading" />
  <div v-else-if="users.length">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Uid</th>
          <th scope="col">Имя</th>
          <th scope="col">E-mail</th>
          <th scope="col">Телефон</th>
          <th scope="col">Дата регистрации</th>
          <th scope="col">Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, idx) in users" :key="idx">
          <th scope="row">{{ idx + 1 }}</th>
          <td>{{ user.uid }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone_number }}</td>
          <td>{{ user.registration_date | date }}</td>
          <td>
            <!-- <SubmitButton
              :loading="buttonLoading"
              button-class="btn btn-danger"
              button-label="Удалить"
              @click.prevent="deleteUser(user.uid)"
            /> -->
            <button class="btn btn-danger" @click.prevent="deleteUser(user.uid)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <h5 v-else>
    Пользователей нету
  </h5>
</template>

<script>
export default {
  name: 'Userboard',
  data: () => ({
    loading: true,
    buttonLoading: false,
  }),
  computed: {
    users() {
      return this.$store.getters.users || [];
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchUsers');
    this.loading = false;
  },
  methods: {
    async deleteUser(uid) {
      const answer = confirm(uid);
      if (answer) {
        await this.$store.dispatch('deleteUser', { uid });
      }
    },
  },
};
</script>

<style></style>
