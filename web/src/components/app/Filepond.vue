<template>
  <file-pond
    ref="pond"
    name="test"
    :allow-multiple="true"
    accepted-file-types="image/jpeg, image/png"
    :server="server"
    :max-files="10"
    label-idle="Перетащите сюда изображения..."
    label-file-added="Файл добавлен"
    label-file-count-plural="Файлы"
    label-file-count-singular="Файл"
    label-file-load-error="Ошибка при загрузке"
    label-file-loading="Загрузка"
    label-file-processing="Загрузка"
    label-file-processing-aborted="Загрузка отменена"
    label-file-processing-complete="Загрузка завершена"
    label-file-processing-error="Ошибка загрузки файла"
    label-file-removed="Файл удален"
    label-file-size-not-available="Размер не доступен"
    label-file-waiting-for-size="Проверка размера"
    label-tap-to-undo="Удалить"
    label-tap-to-cancel="Отмена"
    @init="handleFilePondInit"
  />
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
);

export default {
  name: 'App',
  components: {
    FilePond,
  },
  data: () => ({
    server: {
      url: `${process.env.VUE_APP_API}`,
      process: 'file',
      revert: 'file',
    },
  }),
  methods: {
    handleFilePondInit() {
      console.log('FilePond has initialized');

      // FilePond instance methods are available on `this.$refs.pond`
      console.log(this.$refs.pond);
    },
  },
};
</script>

<style>
.filepond--wrapper {
  width: 60%;
}
</style>
