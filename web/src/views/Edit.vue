<template>
  <div class="container">
    <div class="row mx-0 mb-5 justify-content-center">
      <form class="post_form col-lg-8 col-md-12 col-sm-12 col-12 pt-4">
        <div class="post_form-title">
          <span>Редактировать участок</span>
        </div>
        <Loader v-if="loading" class="pb-5" />
        <div v-else-if="post">
          <div class="form-group">
            <label for="postTitle" class="required">Название</label>
            <div class="formWithSupText">
              <input
                id="postTitle"
                v-model.trim="title"
                type="text"
                class="post_form-control"
                autocomplete="off"
              />
              <span v-if="$v.title.$dirty && !$v.title.required" class="invalid">
                Заполните это поле
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="postLocation" class="required">Расположение</label>
            <div class="formWithSupText">
              <input
                id="postLocation"
                v-model.trim="location"
                type="text"
                class="post_form-control"
                placeholder="Адрес"
                autocomplete="off"
              />
              <span v-if="$v.location.$dirty && !$v.location.required" class="invalid">
                Заполните это поле
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="image-upload" class="required">Изображения</label>
            <div class="formWithSupText">
              <input
                id="image-upload"
                v-model.trim="inputImage"
                type="text"
                class="post_form-control"
                placeholder="Вставьте ссылку и нажмите Enter"
                autocomplete="off"
                @keydown.enter.prevent="addToImages(inputImage)"
              />
              <button class="btn btn-addImage" @click.prevent="addToImages(inputImage)">
                Добавить
              </button>
              <span v-if="$v.inputImage.$dirty && !$v.inputImage.url" class="invalid"
                >Вставьте ссылку</span
              >
              <span v-else-if="$v.images.$dirty && !$v.images.required" class="invalid">
                Минимальное кол-во изображений 1
              </span>
              <span v-else-if="$v.images.$dirty && !$v.images.maxLength" class="invalid">
                Максимальное кол-во изображений 10
              </span>
            </div>
            <div v-if="images.length" class="imagesPreviewWrapper">
              <div v-for="(image, idx) of images" :key="idx" class="imagePreviewContainer">
                <img :src="image" class="image-preview" />
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click="removeFromImages(idx)"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="postSpace" class="required">Площадь</label>
            <div class="formWithSupText">
              <input
                id="postSpace"
                v-model.trim="space"
                type="number"
                min="0"
                step="any"
                class="post_form-control w-25"
                autocomplete="off"
              />
              <span class="post_form-suptext">га</span>
              <span v-if="$v.space.$dirty && !$v.space.required" class="invalid">
                Заполните это поле
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="required" for="postPrice">Стоимость</label>
            <div class="formWithSupText">
              <input
                id="postPrice"
                v-model.number.trim="price"
                type="number"
                class="post_form-control w-25"
                autocomplete="off"
              />
              <span class="post_form-suptext">тенге</span>
              <span v-if="$v.price.$dirty && !$v.price.required" class="invalid">
                Заполните это поле
              </span>
              <span v-else-if="$v.price.$dirty && !$v.price.decimal" class="invalid">
                Только положительные числа
              </span>
            </div>
          </div>
          <div class="form-group">
            <label>Целевое назначение</label>
            <div v-for="category in categoriesTypes" :key="category.id" class="form-check">
              <input
                v-model="categories"
                class="form-check-input"
                type="checkbox"
                :value="category.id"
              />
              <span>{{ category.name }}</span>
            </div>
          </div>
          <!-- <div class="form-group">
            <label for="iin" class="required">ИИН</label>
            <div class="formWithSupText">
              <input
                id="iin"
                v-model.trim="iin"
                type="text"
                class="post_form-control w-25"
                autocomplete="off"
              />
              <span v-if="$v.iin.$dirty && !$v.iin.required" class="invalid">
                Заполните это поле
              </span>
              <span v-if="!$v.iin.minLength" class="invalid">
                Не меньше 12
              </span>
              <span v-else-if="!$v.iin.maxLength" class="invalid">
                Не больше 12
              </span>
              <span v-else-if="!$v.iin.decimal" class="invalid">
                Только положительные числа
              </span>
            </div>
          </div> -->
          <div class="form-group">
            <label class="required" for="map" title="Нарисуйте полигон или введите кад. номер">
              Карта
            </label>
            <span
              v-if="$v.mapData.features.$dirty && !$v.mapData.features.required"
              class="invalid"
            >
              Нарисуйте полигон или введите кад. номер
            </span>
            <FormMap />
          </div>
          <div class="form-group">
            <label for="postDescription">Описание</label>
            <textarea
              id="postDescription"
              v-model.trim="description"
              class="post_form-control"
              rows="5"
            ></textarea>
          </div>
          <div class="row">
            <div class="col-lg-3 col-md-5 col-sm-12 col-12 mr-auto">
              <button class="btn btn-submit w-100" @click.prevent="updatePost()">Сохранить</button>
            </div>
            <div class="col-lg-3 col-md-5 col-sm-12 col-12 ml-auto mt-lg-0 mt-md-0 mt-3">
              <button class="btn btn-delete w-100" @click.prevent="deletePost()">Удалить</button>
            </div>
          </div>
        </div>
        <div v-else>Объявление не найдено.</div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, url, maxLength, decimal, minLength } from 'vuelidate/lib/validators';
import FormMap from '@/components/Form/FormMap.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'EditPost',
  components: { FormMap },
  data: () => ({
    post: {},
    pid: '',
    title: '',
    description: '',
    location: '',
    space: '',
    categories: [],
    price: '',
    inputImage: '',
    images: [],
    iin: '',
    mapGeometry: null,
    mapZoom: null,
    mapCenter: [],
    loading: true,
  }),
  validations: {
    title: {
      required,
    },
    space: {
      required,
    },
    location: {
      required,
    },
    images: {
      required,
      maxLength: maxLength(10),
    },
    inputImage: {
      url,
    },
    price: {
      required,
      decimal,
    },
    mapData: {
      features: {
        required,
      },
    },
    iin: {
      required,
      decimal,
      minLength: minLength(12),
      maxLength: maxLength(12),
    },
  },
  computed: {
    ...mapGetters(['message', 'mapData', 'categoriesTypes', 'features_id']),
  },
  async mounted() {
    await this.$store.dispatch('fetchPostByPid', { pid: +this.$route.params.id });
    this.post = this.$store.getters.currentPost;
    if (Object.keys(this.post).length) {
      this.setupValues();
    }
    this.loading = false;
  },
  methods: {
    async updatePost() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const postData = {
        pid: this.pid,
        title: this.title || '',
        price: this.price || '',
        location: this.location || '',
        space: this.space || '',
        images: this.images || [],
        categories: this.categories || [],
        description: this.description || '',
        features: this.mapData.features || [],
        zoom: this.mapData.zoom || null,
        center: this.mapData.center || [],
      };
      await this.$store.dispatch('updatePost', postData);
      if (this.message.type !== 'error') {
        this.$router.push('/catalog');
      }
    },
    async deletePost() {
      const answer = confirm('Удалить участок?');
      if (answer) {
        await this.$store.dispatch('deletePost', { pid: this.pid });
        if (this.message.type !== 'error') {
          this.$router.push('/catalog');
        }
      }
    },
    addToImages(image) {
      if (this.$v.inputImage.$invalid) {
        this.$v.inputImage.$touch();
        return;
      }
      if (image) {
        this.images.push(image);
        this.inputImage = '';
      }
    },
    removeFromImages(index) {
      this.images.splice(index, 1);
    },
    setupValues() {
      this.pid = this.post.pid;
      this.title = this.post.title;
      this.description = this.post.description;
      this.price = this.post.price;
      this.location = this.post.location;
      this.categories = this.post.categories;
      this.space = this.post.space;
      this.iin = this.post.iin;
      this.images = this.post.images;

      this.$store.commit('setFeaturesId', this.post.features_id || []);
    },
  },
};
</script>

<style lang="scss"></style>
