<template>
  <div class="container">
    <div class="row mx-0 mb-5 justify-content-center">
      <form
        class="post_form col-lg-8 col-md-12 col-sm-12 col-12 pt-4"
        @submit.prevent="submitHandler"
      >
        <div class="post_form-title">
          <span>{{ pageTitle }}</span>
        </div>
        <div class="form-group">
          <label for="postTitle" class="required">Название</label>
          <div class="formWithSupText">
            <input
              id="postTitle"
              v-model.trim="data.title"
              type="text"
              class="post_form-control"
              autocomplete="off"
            />
            <span v-if="$v.data.title.$dirty && !$v.data.title.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label for="postLocation" class="required">Расположение</label>
          <div class="formWithSupText">
            <input
              id="postLocation"
              v-model.trim="data.location"
              type="text"
              class="post_form-control"
              placeholder="Адрес"
              autocomplete="off"
            />
            <span v-if="$v.data.location.$dirty && !$v.data.location.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label for="image-upload" class="required">Изображения</label>
          <div class="formWithSupText">
            <input
              id="image-upload"
              v-model.trim="data.imageUrl"
              type="text"
              class="post_form-control"
              placeholder="Вставьте ссылку и нажмите Enter"
              autocomplete="off"
              @keydown.enter.prevent="addToImages(data.imageUrl)"
            />
            <button class="btn btn-addImage" @click.prevent="addToImages(data.imageUrl)">
              Добавить
            </button>
            <span v-if="$v.data.imageUrl.$dirty && !$v.data.imageUrl.url" class="invalid"
              >Вставьте ссылку</span
            >
            <span v-else-if="$v.data.images.$dirty && !$v.data.images.required" class="invalid">
              Минимальное кол-во изображений 1
            </span>
            <span v-else-if="$v.data.images.$dirty && !$v.data.images.maxLength" class="invalid">
              Максимальное кол-во изображений 10
            </span>
          </div>
          <div v-if="data.images.length" class="imagesPreviewWrapper">
            <div v-for="(image, idx) of data.images" :key="idx" class="imagePreviewContainer">
              <img :src="image" class="image-preview" />
              <button type="button" class="close" aria-label="Close" @click="removeFromImages(idx)">
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
              v-model.trim="data.space"
              type="number"
              min="0"
              step="any"
              class="post_form-control w-25"
              autocomplete="off"
            />
            <span class="post_form-suptext">га</span>
            <span v-if="$v.data.space.$dirty && !$v.data.space.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="required" for="postPrice">Стоимость</label>
          <div class="formWithSupText">
            <input
              id="postPrice"
              v-model.number.trim="data.price"
              type="number"
              class="post_form-control w-25"
              autocomplete="off"
            />
            <span class="post_form-suptext">тенге</span>
            <span v-if="$v.data.price.$dirty && !$v.data.price.required" class="invalid">
              Заполните это поле
            </span>
            <span v-else-if="$v.data.price.$dirty && !$v.data.price.decimal" class="invalid">
              Только положительные числа
            </span>
          </div>
        </div>
        <div class="form-group">
          <label>Целевое назначение</label>
          <div class="form-check">
            <input
              v-model="data.categories"
              class="form-check-input"
              type="checkbox"
              value="Товарное сельское хозяйство"
            />
            <span>Товарное сельское хозяйство</span>
          </div>
          <div class="form-check">
            <input
              v-model="data.categories"
              class="form-check-input"
              type="checkbox"
              value="Коммерческое"
            />
            <span>Коммерческое</span>
          </div>
          <div class="form-check">
            <input
              v-model="data.categories"
              class="form-check-input"
              type="checkbox"
              value="Многоэтажное жилищное строительство"
            />
            <span>Многоэтажное жилищное строительство</span>
          </div>
          <div class="form-check">
            <input
              v-model="data.categories"
              class="form-check-input"
              type="checkbox"
              value="Индивидуальное жилищное строительство"
            />
            <span>Индивидуальное жилищное строительство</span>
          </div>
        </div>
        <div class="form-group">
          <label
            class="required"
            for="map"
            title="Нарисуйте полигон нажав на кнопку в правом верхнем углу карты"
          >
            Карта
          </label>
          <span v-if="$v.data.mapGeometry.$dirty && !$v.data.mapGeometry.required" class="invalid">
            Нарисуйте полигон и сохраните
          </span>
          <Map />
        </div>
        <div class="form-group">
          <label for="postDescription">Описание</label>
          <textarea
            id="postDescription"
            v-model.trim="data.description"
            class="post_form-control"
            rows="5"
          ></textarea>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-5 col-sm-12 col-12 mr-auto">
            <button class="btn btn-submit w-100" type="submit">Сохранить</button>
          </div>
          <div
            v-if="$route.name === 'edit-post'"
            class="col-lg-3 col-md-5 col-sm-12 col-12 ml-auto mt-lg-0 mt-md-0 mt-3"
          >
            <button class="btn btn-delete w-100" @click.prevent="deletePost()">Удалить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, url, maxLength, decimal } from 'vuelidate/lib/validators';
import Map from '@/components/app/Map.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PostForm',
  components: {
    Map,
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Форма',
    },
    data: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        location: '',
        space: '',
        categories: [],
        price: '',
        imageUrl: '',
        images: [],
      }),
    },
    submitHandler: {
      type: Function,
      default: () => ({}),
    },
  },
  data: () => ({}),
  validations: {
    data: {
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
      imageUrl: {
        url,
      },
      price: {
        required,
        decimal,
      },
      mapGeometry: {
        required,
      },
      // email: {
      //   required,
      //   email,
      // },
      // author: {
      //   required,
      // },
    },
  },
  computed: {
    ...mapGetters(['message', 'mapData']),
  },
  methods: {
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
      if (this.$v.data.imageUrl.$invalid) {
        this.$v.data.imageUrl.$touch();
        return;
      }
      if (image) {
        this.data.images.push(image);
        this.data.imageUrl = '';
      }
    },
    removeFromImages(index) {
      this.data.images.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
#image-upload {
  width: calc(60% - 95.72px);
}
</style>
