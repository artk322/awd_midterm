<template>
  <div class="row justify-content-center mt-5 mx-0">
    <div class="col-lg-5 col-md-8 col-sm-10 col-12">
      <div class="jumbotron bg-white py-4">
        <component :is="form" />
      </div>
    </div>
  </div>
</template>

<script>
import ResetPassword from '@/components/ForgotPassword/ResetPassword.vue';
import SendRecoveryEmail from '@/components/ForgotPassword/SendRecoveryEmail.vue';

export default {
  name: 'ForgotPassword',
  components: {
    ResetPassword,
    SendRecoveryEmail,
  },
  data: () => ({
    loading: false,
    emailToken: null,
    timeOut: false,
    currentForm: 'SendRecoveryEmail',
  }),
  computed: {
    form() {
      if (this.emailToken) {
        return 'ResetPassword';
      } else {
        return 'SendRecoveryEmail';
      }
    },
  },
  created() {
    this.emailToken = this.$route.query.token || null;
  },
};
</script>

<style scoped></style>
