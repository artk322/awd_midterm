<template>
  <div class="row justify-content-center mt-5 mx-0">
    <div class="col-lg-5 col-md-8 col-sm-10 col-12">
      <div class="jumbotron bg-white py-4">
        <transition name="fade" mode="out-in">
          <component :is="signUpAction" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserData from '@/components/SignUp/UserData.vue';
import VerifyNCA from '@/components/SignUp/VerifyNCA.vue';

export default {
  name: 'SignUp',
  components: { UserData, VerifyNCA },
  computed: {
    ...mapGetters(['message', 'signUpAction', 'formUserData']),
  },
};
</script>
