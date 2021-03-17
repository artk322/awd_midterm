<template>
  <div id="leftside-content">
    <nav id="sidebar" :class="{ active: sidebarActive }">
      <ul class="list-unstyled">
        <li>
          <a href class="nav-link disabled rounded-top border-top" title="Навигационное меню">
            <i class="icon nav-menu-white"></i>
            <span>Навигационное меню</span>
          </a>
          <a
            href="#company-objects"
            data-toggle="collapse"
            aria-expanded="false"
            class="dropdown-toggle current"
            title="Каталог товаров"
          >
            <i class="icon holding"></i>
            <span style="transform: translateY(-20%);">Земельные участки</span>
          </a>
          <ul id="company-objects" class="collapse list-unstyled">
            <li>
              <router-link to="/catalog">Участки</router-link>
            </li>
          </ul>
          <a
            v-if="$route.name == 'catalog'"
            href="#categories"
            class="dropdown-toggle"
            title
            data-toggle="collapse"
            aria-expanded="false"
          >
            <i class="icon category"></i>
            <span>Целевое назначение</span>
          </a>
          <ul id="categories" class="collapse list-unstyled">
            <li v-for="category in filterCategories" :key="category.id">
              <a
                :title="category.name"
                :class="{ current: selected_category == category.id }"
                @click="$store.commit('select_category', category.id)"
              >
                <span>{{ category.name }} </span>
                <span class="abbr">{{ category.abbr }}</span>
              </a>
            </li>
          </ul>
          <!-- <router-link
            to="/catalog?filters=hot"
            title="Мои объявления"
            style="white-space: nowrap;"
          >
            <i class="icon user"></i>
            <span>Мои объявления</span>
          </router-link> -->
          <a id="sidebarCollapse" @click.prevent="toggleSidebar()">
            <i class="icon menu"></i>
            <span>Свернуть меню</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- <div v-if="hots" id="hot-objects" :class="{ active: sidebarActive }">
      <div class="hot-objects">
        <div class="hot-title">
          <span class="title pr-2">Активные торги</span>
          <i class="icon hot-white"></i>
        </div>
        <Loader v-if="loading" style="height: 200px" />
        <div v-else class="hot_object post-info">
          <a class="slider__link" href="#" title="Товар 1">
            <div class="img-block">
              <img :src="hots[0].images[0]" alt="Земельный участок" class="post-image" />
            </div>
            <div class="row mb-3">
              <div class="col-lg-7 col-md-7 col-sm-12 pr-0">
                <span class="post-title">{{ hots[0].title }}</span>
              </div>
              <div
                class="col-lg-5 col-md-5 col-sm-12 text-lg-right text-md-right text-sm-left text-left pl-md-0 pl-lg-0"
              >
                <span class="post-price">{{ Number(hots[0].price).toLocaleString() + ' тг' }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
                <i class="icon location"></i>
              </div>
              <div
                class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
                style="display: flex; align-items: center;"
              >
                <span v-if="hots[0].location" class="post-location">
                  {{ hots[0].location }}
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
                <span v-if="hots[0].space" class="post-space">{{ hots[0].space }} га</span>
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
                <span class="post-category">
                  {{ toAbbr(hots[0].categories.join(', ')) }}
                </span>
              </div>
            </div>
            <div v-if="hots[0].date" class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                <span class="post-date">Дата торгов: {{ hots[0].date }}</span>
              </div>
            </div>
          </a>
        </div>
        <a href="#" target="_blank" title="Ссылка на товар">
          <span class="auctionLink">Перейти</span>
        </a>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',
  props: {
    loading: {
      type: Boolean,
    },
  },
  data: () => ({
    hots: null,
  }),
  computed: {
    ...mapGetters(['sidebarActive', 'filterCategories', 'selected_category']),
  },
  methods: {
    toggleSidebar() {
      this.$store.commit('toggleSidebar');
    },
  },
};
</script>

<style>
#leftside-content {
  margin-right: 20px;
  transition: all 0.3s ease !important;
}

.hot-objects .hot-title {
  color: #fff !important;
  background-color: #222222;
  font-size: 16px;
  line-height: 19px;
  display: block;
  padding: 15px 20px;
  border-bottom: 1px solid #cccccc;
  white-space: nowrap;
  height: 50px;
}

.hot-objects .auctionLink {
  color: #fff !important;
  background-color: #c4c4c4;
  font-size: 14px;
  line-height: 16px;
  display: block;
  height: 25px;
  justify-content: center;
  text-align: center;
  padding: 4px 20px;
}

.hot-objects .auctionLink:hover {
  background-color: #b5b5b5;
}

.hot-objects .hot_object {
  margin: 20px;
  position: relative;
}

#usefull-links.active,
#hot-objects.active {
  opacity: 0;
  min-width: 90px !important;
  max-width: 90px !important;
  transition: 0.3s;
  border: 0;
}

#usefull-links.active ul,
#hot-objects.active .hot-objects {
  display: none !important;
}

#usefull-links,
#hot-objects {
  background-color: #fff !important;
  overflow: hidden;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-weight: normal;
  max-width: 310px;
  min-width: 310px;
  transition: all 0.3s;
  margin-top: 20px;
  margin-bottom: 20px;
}

#leftside-content ul {
  margin-bottom: 0;
}

#leftside-content ul li a.disabled {
  background-color: #222222;
  height: 50px;
  white-space: nowrap;
  cursor: text !important;
}

#leftside-content ul li a.disabled span {
  color: #ffffff !important;
  font-size: 16px;
  line-height: 19px;
  cursor: text !important;
}

#usefull-links ul li a {
  padding: 15px 20px;
  font-size: 1em;
  display: block;
}

#usefull-links ul li {
  border-top: 0;
  border-bottom: 1px solid #cccccc;
}

#usefull-links ul li a span {
  color: #56739d !important;
}

#usefull-links ul li a:hover span {
  color: #0e4dac !important;
  transition: 0s !important;
}

#usefull-links li:last-child {
  border-bottom-left-radius: 5px !important;
  border-bottom: 0;
}

#sidebar {
  min-width: 310px;
  max-width: 310px;
  color: #222222;
  position: relative;
  transition: all 0.3s !important;
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
  border: none;
  overflow: hidden;
}

#sidebar.active {
  min-width: 90px;
  max-width: 90px;
  text-align: center;
}

#sidebar ul.show li a {
  border-top: none !important;
}

#sidebar.active ul ul a {
  padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
  display: none;
}

#sidebar ul li a {
  height: 50px;
  padding: 15px 20px;
  font-size: 16px;
  display: block;
  border-left: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
  text-align: left;
  color: #222222;
  background-color: #ffffff;
}

#sidebar ul li a span {
  white-space: nowrap !important;
  text-overflow: ellipsis;
}

#sidebar ul li a:last-child {
  border-radius: 0 0 5px 5px;
}

#sidebar.active ul li a {
  text-align: center;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#sidebar ul li a:hover {
  color: #f4dc00 !important;
  border-left: 4px solid #f4dc00;
}

#sidebar ul li ul li a.current {
  border-left: 4px solid #f4dc00;
  color: #222222;
}

#sidebar ul li a i {
  color: #555555;
  font-size: 1.5em;
}

#sidebar ul.show li a i {
  color: #364e72;
}

#sidebar.active ul.show li a i,
#sidebar.active ul.collapsing li a i {
  font-size: 1em;
}

a[data-toggle='collapse'] {
  position: relative;
}

#sidebarCollapse {
  white-space: nowrap !important;
}

#sidebar ul li a#sidebarCollapse:hover {
  color: #8a8a8a !important;
  border-left: 1px solid #cccccc;
}

#sidebar.active ul li a:hover {
  border-left: 1px solid #cccccc !important;
}

.dropdown-toggle::after {
  color: #222222;
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: rotate(-90deg);
  transition: transform 0.3s;
  border-top: 0.325em solid !important;
  border-right: 0.335em solid transparent !important;
  border-bottom: 0;
  border-left: 0.325em solid transparent !important;
}

#sidebar a[aria-expanded='true'].dropdown-toggle::after {
  transform: rotate(0) !important;
  transition: transform 0.3s;
}

#sidebar ul ul a {
  height: auto !important;
  font-size: 1em !important;
  padding-left: 55px !important;
  background: #fff;
  border-radius: 0 !important;
  border-bottom: 0.2px solid #cccccc !important;
}

#sidebar li :hover {
  cursor: pointer;
}

#sidebar span {
  display: inline-block;
}

#sidebar.active span {
  display: none;
}

#sidebar.active ul ul a span.abbr,
#sidebar ul ul a span {
  white-space: normal !important;
  display: inline-block !important;
}

#sidebar.active ul ul a span,
#sidebar ul ul a span.abbr {
  display: none !important;
}
</style>
