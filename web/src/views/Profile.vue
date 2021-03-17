<template>
  <div class="container">
    <div class="row mx-0 mb-5 justify-content-center">
      <div class="profile-block col-lg-12 col-md-12 col-sm-12 col-12 pt-4">
        <ul class="nav nav-pills nav-fill mb-5">
          <li v-for="tab in tabs" :key="tab.id" class="nav-item">
            <a
              class="nav-link"
              :class="{ active: currentTab == tab.id }"
              @click.prevent="switchTab(tab.id)"
            >
              {{ tab.title }}
            </a>
          </li>
        </ul>
        <div class="profile-title">
          <span>{{ currentTitle }}</span>
        </div>
        <transition
          name="fade"
          mode="out-in"
          @beforeLeave="beforeLeave"
          @enter="enter"
          @afterEnter="afterEnter"
        >
          <keep-alive>
            <component :is="currentTab" />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import UserSettings from '@/components/Profile/UserSettings.vue';
import PostBoard from '@/components/Profile/PostBoard.vue';
import UserBoard from '@/components/Profile/UserBoard.vue';

export default {
  name: 'Profile',
  components: {
    UserSettings,
    PostBoard,
    UserBoard,
  },
  data: () => ({
    prevHeight: 0,
  }),
  computed: {
    tabs() {
      return this.$store.getters.tabs(this.is_admin);
    },
    is_admin() {
      return this.$store.getters.userData.is_admin;
    },
    currentTitle() {
      return this.tabs.find(it => it.id === this.currentTab).title ?? '';
    },
    currentTab() {
      return this.$store.getters.currentTab || this.$route.query.tab;
    },
  },
  mounted() {
    const tab = this.$route.query.tab || this.currentTab;
    this.$store.commit('switchTab', tab);
  },
  methods: {
    switchTab(tab) {
      this.$router.push({ query: { tab } });
      this.$store.commit('switchTab', tab);
    },
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);
      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
  },
};
</script>

<style scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.profile-block {
  background: #ffffff;
  border-radius: 5px;
  padding: 30px 20px !important;
  transition: all 0.65s ease;
}
.profile-title {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 23px;
  line-height: 21px;
  letter-spacing: 0.01em;
  color: #555555;
}
.nav-link {
  cursor: pointer;
}
.nav-link.active {
  color: #212529;
  font-weight: 500;
  background-color: #ffc107;
  border-color: #ffc107;
}
.nav-link.active:hover {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
}
</style>
