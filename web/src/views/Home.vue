<template>
  <div class="container">
    <div id="company-description" class="mb-4">
      <div class="gradient">
        <div class="justify-content-center vertical-align-center py-5">
          <h1 class="company-title">ТОО "Zher E-Batys"</h1>
          <br />
          <span class="company-description">
            УПРАВЛЕНИЕ, РАЗВИТИЕ И РЕАЛИЗАЦИЯ
            <br />ЗЕМЕЛЬНЫХ УЧАСТКОВ
          </span>
          <br />
          <span class="sub-description">
            <span>
              «Zher E-Batys» – крупный интернет-магазин
              <br />по продаже земельных участков в Казахстане.
            </span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="hots.length" class="company-hot-objects my-4">
      <div class="container">
        <div class="row">
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 py-4">
            <router-link to="/catalog" class="company-objects-title" title="Активные торги">
              <span style="padding-left: 15px;">
                Активные торги
                <i class="icon chevron-right ml-2"></i>
              </span>
            </router-link>
          </div>
        </div>
        <Loader v-if="loading" style="height: 350px" />
        <!-- <VueSlickCarousel
          v-else
          :dots="true"
          :slides-to-scroll="1"
          :slides-to-show="3"
          v-bind="settings"
        >
          <div v-for="(hot, idx) of hots" :key="idx" class="post-sliders post-info">
            <router-link :to="'/post/' + hot.id">
              <div class="img-block">
                <img v-if="hot.images" :src="hot.images[0]" :alt="hot.title" class="post-image" />
                <img
                  v-else
                  src="https://firebasestorage.googleapis.com/v0/b/vue-realty.appspot.com/o/80land_1.png?alt=media&token=fe18755c-f94a-494f-836d-3408052e8e03"
                  :alt="hot.title"
                  class="post-image"
                />
              </div>
              <div class="row mb-3">
                <div class="col-lg-8 col-md-7 col-sm-12 pr-0">
                  <span class="post-title">{{ hot.title }}</span>
                </div>
                <div
                  v-if="hot.price"
                  class="col-lg-4 col-md-5 col-sm-12 text-lg-right text-md-right text-sm-left text-left pl-md-0 pl-lg-0"
                >
                  <span class="post-price">{{ Number(hot.price).toLocaleString() + ' тг' }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
                  <i class="icon location"></i>
                </div>
                <div
                  class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2 text-ellipsis"
                  style="display: flex; align-items: center;"
                >
                  <span v-if="hot.location" class="post-location">
                    {{ hot.location }}
                  </span>
                  <span v-else class="post-location">Адрес не указан.</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
                  <i class="icon space"></i>
                </div>
                <div
                  class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
                  style="display: flex; align-items: center;"
                >
                  <span v-if="hot.space" class="post-space">{{ hot.space }} га</span>
                  <span v-else class="post-space">Площадь не указана.</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
                  <i class="icon category"></i>
                </div>
                <div
                  class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
                  style="display: flex; align-items: center;"
                >
                  <span v-if="hot.categories" class="post-category">
                    {{ toAbbr(hot.categories.join(', ')) }}
                  </span>
                  <span v-else class="post-category">Целевое назначение - отсутсвует.</span>
                </div>
              </div>
              <div v-if="hot.date" class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                  <span class="post-date">Дата торгов: {{ hot.date }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </VueSlickCarousel> -->
        <!--row-->
      </div>
      <!--container-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    loading: true,
    settings: {
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    },
  }),
  computed: {
    ...mapGetters(['hots']),
  },
  async mounted() {
    await this.$store.dispatch('fetchApprovedPosts');
    this.loading = false;
  },
  methods: {
    toAbbr(string) {
      string = string.replace('Товарное сельское хозяйство', 'ТСХ');
      string = string.replace('Многоэтажное жилищное строительство', 'МЖС');
      string = string.replace('Индвивидуальное жилищное строительство', 'ИЖС');
      return string;
    },
  },
};
</script>
<style lang="scss">
.gradient {
  background: linear-gradient(127.88deg, #000000 0%, rgba(0, 0, 0, 0.7) 100%);
  min-height: 397px;
  border-radius: 5px;
}

#company-description {
  background-image: url('../assets/static/images/background-image.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #cccccc;
  min-height: 397px;
  max-width: 100%;
  z-index: 10;
  img {
    position: relative;
    z-index: -1;
  }
}

.sub-description,
.company-title,
.company-description {
  color: #ffffff !important;
  z-index: 20;
  text-align: center;
  display: block;
}

.company-description {
  text-transform: uppercase;
  font-family: Montserrat, sans-serif;
  font-weight: bold;
  font-size: 26px;
  line-height: 38px;
  font-style: normal;
  padding: 14px 0;
}

.sub-description,
.company-title {
  font-family: Roboto, sans-serif;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  font-style: normal;
  padding: 14px 0;
  max-width: 436px;
  margin-left: auto;
  margin-right: auto;
}

.post-sliders {
  overflow: hidden;
  padding-left: 15px;
  padding-right: 15px;
}

.company-hot-objects {
  background: #ffffff;
  border-radius: 5px;
}

a.company-objects-title:hover {
  color: #f4dc00 !important;
  border: 0;
}

.company-objects-block {
  border-radius: 5px;
  overflow: hidden;
  background-color: #ffffff !important;
}

.company-objects-title {
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
  color: #000000;
}
.company-objects-block a {
  cursor: pointer;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
