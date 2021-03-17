<template>
  <nav class="breadcrumb-nav" aria-label="breadcrumb">
    <ul class="breadcrumb border-bottom">
      <router-link to="/catalog" tag="li" back class="breadcrumb-item" exact-active-class="active">
        <a href>
          <i
            v-if="this.$route.name === 'post'"
            class="icon chevron-right-white"
            style="transform: rotate(180deg); margin-left: 0;"
          />
          Земельные участки
        </a>
      </router-link>
      <li v-if="this.$route.name === 'catalog'" class="right-button">
        <a
          title="Сортировать"
          data-toggle="collapse"
          data-target="#sort"
          aria-expanded="true"
          aria-controls="sort"
        >
          <i class="icon control"></i>
        </a>
      </li>
      <li v-else-if="this.$route.name === 'post' && canEdit" class="right-button">
        <PostControl :data="controls" @action="onAction" />
      </li>
    </ul>
    <ul
      v-if="this.$route.name === 'catalog'"
      id="sort"
      class="breadcrumb collapse"
      style="border-radius: 0px !important;"
    >
      <li class="title-sort">
        <a href="#">Название</a>
        <div id="title-sort">
          <a href="#">
            <i class="current icon arrow-up mx-1"></i>
          </a>
          <a href="#">
            <i class="icon arrow-down"></i>
          </a>
        </div>
      </li>
      <li class="price-sort mx-5">
        <a href="#">Цена</a>
      </li>
      <!-- <li class="date-sort">
        <a href="#">Дата торгов</a>
      </li> -->
    </ul>
  </nav>
</template>

<script>
/*eslint-disable no-case-declarations*/
import PostControl from '@/components/Catalog/PostControl.vue';
import { mapGetters } from 'vuex';

export default {
  components: { PostControl },
  computed: {
    ...mapGetters(['userData', 'currentPost', 'message']),
    controls() {
      return this.$store.getters.controls(this?.userData?.is_admin || false);
    },
    canEdit() {
      const { currentPost, userData } = this;
      if (userData?.uid === currentPost?.owner_uid || userData?.is_admin) {
        return true;
      } else {
        return false;
      }
    },
    pid() {
      return this.$route.params.id || '';
    },
  },
  methods: {
    async onAction(data) {
      switch (data.action) {
        case 'edit':
          this.$router.push('/edit-post/' + this.pid);
          break;
        case 'hide':
          if (this.userData.is_admin) {
            await this.$store.dispatch('updatePostStatus', { pid: this.pid, status: 'hidden' });
          }
          break;
        case 'archive':
          await this.$store.dispatch('updatePostStatus', { pid: this.pid, status: 'archived' });
          break;
        case 'approve':
          if (this.userData.is_admin) {
            await this.$store.dispatch('updatePostStatus', { pid: this.pid, status: 'approved' });
          }
          break;
        case 'deny':
          if (this.userData.is_admin) {
            await this.$store.dispatch('updatePostStatus', {
              pid: this.pid,
              status: 'not approved',
            });
          }
          break;
        case 'delete':
          const answer = confirm('Удалить участок?');
          if (answer) {
            await this.$store.dispatch('deletePost', { pid: this.pid });
            if (this.message.type !== 'error') {
              this.$router.push('/catalog');
            }
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  display: flex;
  flex-direction: row;
  background-color: #222222 !important;
  margin-bottom: 0 !important;
  border-radius: 5px 5px 0 0 !important;
  color: #ffffff !important;
  min-height: 50px;
  padding: 10px 20px !important;
  align-items: center;
}

.breadcrumb i.chevron-right-white {
  margin-left: 10px;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
}

.breadcrumb a {
  white-space: nowrap;
}

.breadcrumb a:hover {
  color: #f4dc00 !important;
}

.breadcrumb li.active,
.breadcrumb li.active a:hover {
  color: #ffffff !important;
  pointer-events: none;
}

.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0;
  color: #ffffff;
  content: '';
}

.breadcrumb-item + .breadcrumb-item {
  padding-left: 0;
}

.right-button {
  margin-left: auto;
}

.right-button > a {
  display: flex;
  justify-content: center;
  align-items: center;
}

.collapsing {
  -webkit-transition: none;
  transition: none !important;
  display: none;
  height: auto !important;
}
</style>
