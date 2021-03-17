<template>
  <Loader v-if="loading" />
  <div v-else-if="post" class="post-page">
    <div class="container" style="padding-right: 10px; padding-left:10px;">
      <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-6 col-xs-12 pr-0">
          <span class="post-title">
            {{ post.title }}
          </span>
        </div>
        <div
          v-if="post.price"
          class="col-lg-5 col-md-5 col-sm-12 text-lg-right text-md-right text-sm-left text-left pl-md-0 pl-lg-0 pt-lg-0 pt-md-0"
          style="padding-top: 10px;"
        >
          <span v-if="post.price" class="post-price">
            {{ Number(post.price).toLocaleString() + ' тг' }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-6 col-xs-12 pr-0 mr-auto" style="padding-top: 10px;">
          <span v-if="post.status != 'approved'" class="post-status">
            {{ post.status | status }}
          </span>
        </div>
        <div
          v-if="post.creation_date"
          class="col-lg-5 col-md-5 col-sm-6 col-xs-12 text-lg-right text-md-right text-sm-right text-left pl-md-0 pl-lg-0 ml-auto"
          style="padding-top: 10px;"
        >
          <span class="post-date">{{ post.creation_date | date }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-12 gallery">
          <tiny-slider :mouse-drag="true" :loop="false" :nav="false" :controls-text="['', '']">
            <img
              v-for="(slide, idx) of post.images"
              :key="idx"
              class="carousel-image"
              :src="slide"
              :alt="post.title"
            />
          </tiny-slider>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon location"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span>{{ post.location }}</span>
        </div>
      </div>
      <div v-if="post.space" class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon space"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span class="post-space">{{ post.space }} га</span>
        </div>
      </div>
      <div v-if="post.description" class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2"></div>
        <div class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2">
          <div class="post-description">
            <span>{{ post.description }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon category"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span v-if="post.categories.length" class="post-category">
            {{ post.categories | categoriesFull }}
          </span>
          <span v-else class="post-category">Целевое назначение - отсутсвует.</span>
        </div>
      </div>
      <div class="row" style="margin-top: 20px;">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <Map />
        </div>
      </div>
      <div v-if="post">
        <hr />
        <div class="row mt-3">
          <div class="col-12">
            <h5>Автор объявления:</h5>
            <div class="authorData">
              <span v-if="post.name">
                Имя:
                <span class="authorDataContent">{{ post.name }}</span>
              </span>
              <span v-if="post.email">
                Email:
                <span class="authorDataContent">{{ post.email }}</span>
              </span>
              <span v-if="post.phone_number">
                Телефон:
                <span class="authorDataContent">{{ post.phone_number }}</span>
              </span>
              <span v-if="post.iin">
                ИИН:
                <span class="authorDataContent">{{ post.iin }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="notFound">
    <h1>Пост не найден</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueTinySlider from 'vue-tiny-slider';
import Map from '@/components/app/Map.vue';

export default {
  name: 'Post',
  components: {
    Map,
    'tiny-slider': VueTinySlider,
  },
  data: () => ({
    loading: true,
    slider_loading: true,
  }),
  computed: {
    post() {
      return this.$store.getters.currentPost;
    },
    ...mapGetters(['sidebarActive']),
  },
  async mounted() {
    await this.$store.dispatch('fetchPostByPid', { pid: +this.$route.params.id });
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.commit('clearCurrentPost');
  },
};
</script>

<style lang="scss">
.gallery {
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}

.carousel-image {
  border-radius: 5px;
  margin-right: 20px;
}

.authorData {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  color: #555555;
}

.authorDataContent {
  color: #56739d !important;
}

.tns-outer {
  position: relative;
}

.tns-slider {
  display: flex;
  justify-content: space-between;
}

.tns-controls {
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  top: 45%;
  z-index: 1;
  outline: none;
}

.tns-controls {
  button {
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='14' fill='%23222222'/%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M12.3926 20.2217L10.9408 18.7698L15.7112 13.9995L10.9408 9.22909L12.3926 7.77724L18.6149 13.9995L12.3926 20.2217Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='12.4444' height='12.4444' fill='white' transform='matrix(1 0 0 -1 8.55566 20.2217)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    border-radius: 50%;
    width: 1.75em;
    height: 1.75em;
    padding: 0;
    border: none !important;
    opacity: 0.8;
    outline: none;
    position: absolute;
  }

  button:hover {
    opacity: 1;
  }

  button[disabled] {
    opacity: 0.4;
  }

  button[data-controls='prev'] {
    transform: rotate(180deg);
    left: -11px;
  }

  button[data-controls='next'] {
    right: -11px;
  }
}

.tns-visually-hidden {
  display: none;
}
</style>
