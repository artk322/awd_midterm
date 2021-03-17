<template>
  <Loader v-if="loading" />
  <div v-else-if="posts.length" class="table-responsive">
    <div class="row mb-3">
      <div class="col-lg-4 col-md-6 col-sm-12">
        <select v-model="selected_status" class="custom-select">
          <option v-for="status in filterStatus" :key="status.id" :value="status.id">
            {{ status.name }}
          </option>
        </select>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
        <select v-model="selected_category" class="custom-select">
          <option v-for="category in filterCategories" :key="category.id" :value="category.id">
            {{ category.abbr }}
          </option>
        </select>
      </div>
    </div>
    <table class="table table-responsive w-100 d-block d-md-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Адрес</th>
          <th scope="col">Площадь</th>
          <th scope="col">Дата</th>
          <th scope="col">Категория</th>
          <th scope="col">Статус</th>
          <th scope="col">Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, idx) in items" :key="idx">
          <th scope="row">{{ post.pid }}</th>
          <td class="text-ellipsis">
            <span>{{ post.title }}</span>
          </td>
          <td class="text-ellipsis">
            <span>{{ post.location }}</span>
          </td>
          <td class="text-ellipsis">
            <span>{{ post.space }}</span>
          </td>
          <td class="text-ellipsis">
            <span>{{ post.creation_date | date }}</span>
          </td>
          <td class="text-ellipsis">
            <span v-if="post.categories.length">{{ post.categories | categoriesAbbr }}</span>
            <span v-else>Отсутсвует</span>
          </td>
          <td class="text-ellipsis">
            <span class="post-status">{{ post.status | status }}</span>
          </td>
          <td class="text-ellipsis">
            <router-link tag="button" class="btn btn-warning" :to="'post/' + post.pid">
              Открыть
            </router-link>
          </td>
        </tr>
        <tr>
          <td colspan="7">Всего: {{ displayPosts.length }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-container">
      <paginate
        v-if="displayPosts.length > pageSize"
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="''"
        :next-text="''"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-controller prev'"
        :next-class="'page-controller next'"
        :prev-link-class="'page-controller-link'"
        :next-link-class="'page-controller-link'"
      />
    </div>
  </div>
  <h5 v-else>
    У вас пока нету объявлений.
    <router-link class="link" to="/create-post">Добавить?</router-link>
  </h5>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin';
import Paginate from 'vuejs-paginate';
import { mapGetters } from 'vuex';

export default {
  name: 'Postboard',
  components: {
    Paginate,
  },
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    pageSize: 4,
    selected_status: 'all',
    selected_category: 'all',
  }),
  computed: {
    ...mapGetters(['userData', 'filterCategories', 'filterStatus']),
    posts() {
      if (this.userData.is_admin === true) {
        return this.$store.getters.posts || [];
      } else {
        return this.$store.getters.userPosts || [];
      }
    },
    displayPosts() {
      let posts = this.posts;
      if (this.selected_status != 'all') {
        posts = posts.filter(it => it.status == this.selected_status);
      }
      if (this.selected_category != 'all') {
        posts = posts.filter(it => it.categories.includes(this.selected_category));
      }
      return posts;
    },
  },
  watch: {
    displayPosts() {
      this.setupPagination(this.displayPosts, this.pageSize);
    },
  },
  async mounted() {
    const postApi = this.userData.is_admin ? 'fetchAllPosts' : 'fetchUserPosts';
    await this.$store.dispatch(postApi);

    if (this.displayPosts.length) {
      this.setupPagination(this.displayPosts, this.pageSize);
    }
    this.loading = false;
  },
  methods: {},
};
</script>

<style lang="scss">
.text-ellipsis {
  position: relative;
}
.text-ellipsis > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  width: 100%;
}
</style>
