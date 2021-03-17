<template>
  <div class="container">
    <div class="wrapper">
      <Sidebar />
      <div v-cloak id="content" :class="{ active: sidebarActive }">
        <Breadcrumb />
        <div id="sales">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Catalog/Sidebar';
import Breadcrumb from '@/components/Catalog/Breadcrumb';
import { mapGetters } from 'vuex';

export default {
  components: {
    Sidebar,
    Breadcrumb,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['sidebarActive']),
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  width: auto;
  align-items: stretch;
  margin-bottom: 40px;
}

#content {
  width: 100%;
  position: relative;
  border: 1px solid #cccccc;
  border-top: 0 !important;
  border-radius: 5px !important;
  min-height: 400px;
  background-color: #ffffff !important;
}

#sales {
  padding: 20px 10px;
  width: 100%;
  position: relative;
}

#sales .post-info {
  padding-bottom: 20px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.post-page {
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #000;
}

.post-title,
.post-price {
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #222222 !important;
}

.post-page .post-title,
.post-page .post-price {
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
  color: #222222 !important;
}

.post-image {
  transition: all 0.3s;
  width: 100%;
  height: 200px;
}

.post-info {
  display: block;
  overflow: hidden;
}

.post-info:hover .post-image {
  transform: scale(1.1);
  transition: transform 0.4s;
}

.img-block {
  display: block;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 5px;
}

.post-date {
  line-height: 15px;
  font-size: 14px;
  color: #8a8a8a;
  padding-bottom: 20px;
}

.post-description p {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #222222;
  margin-bottom: 0;
}

#content.active {
  #sales .post-image {
    height: 270px !important;
  }
}

.chevron-next {
  right: -12px;
}

.chevron-prev {
  left: -12px;
}

.chevron-next,
.chevron-prev {
  border-radius: 50px;
  width: 26px;
  height: 26px;
  background-color: #222222;
  top: 50%;
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #fff;
  text-align: center;
}

#title-sort,
#price-sort,
#date-sort {
  display: inline-flex !important;
}
.notFound {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  color: #555555;
  text-align: center;
}

.post-location {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
