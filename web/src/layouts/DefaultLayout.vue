<template>
  <router-view />
</template>

<style lang="scss">
.formWithSupText {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .post_form-suptext {
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    margin-left: 10px;
    color: #b8b8b8;
  }
}
.invalid {
  font-weight: 500;
  color: #a70909;
  font-size: 13px;
  line-height: 15px;
  margin-left: 10px;
}
label {
  display: inline-flex !important;
  align-items: center;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: #555555;
}
.image-edit {
  margin-bottom: 0 !important;
}
.image-container {
  border: 2px dashed #d6d6d6 !important;
}
.required::after {
  content: '';
  display: inline-block;
  margin-left: 4px;
  width: 6px;
  height: 6px;
  background-image: url('../assets/static/icons/required-icon.svg');
  background-size: contain;
}

.post_form-control:focus {
  box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.5) !important;
  outline: 0;
}

.post_form-control {
  display: block !important;
  min-width: 175px !important;
  width: 60%;
  height: calc(1.5em + 0.75rem + 2px) !important;
  padding: 0.375rem 0.75rem !important;
  background-color: #ffffff !important;
  background-clip: padding-box !important;
  box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.25) !important;
  border-radius: 2px !important;
  font-weight: normal !important;
  font-size: 15px !important;
  line-height: 18px !important;
  letter-spacing: 0.01em !important;
  color: #222222 !important;
  border-color: transparent !important;
  border: 1px !important;
  transition: box-shadow 0.15s ease-in-out !important;
  height: 30px !important;
}

.post_form-control.space,
.post_form-control.price {
  width: 25%;
}

textarea.post_form-control {
  height: 92px !important;
}

.post_form {
  background: #ffffff;
  border-radius: 5px;
  padding: 30px 20px !important;
}

.post_form-title {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.01em;
  color: #555555;
}
.imagesPreviewWrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 5px -15px;
  .imagePreviewContainer {
    padding: 10px 15px;
    position: relative;
    .close {
      top: 15px;
      right: 25px;
      position: absolute;
    }
    .image-preview {
      width: 150px;
      height: 150px;
      width: 200px;
      background-color: white;
      border: 1px solid #dddddd;
      padding: 5px;
      image-rendering: pixelated;
      border-radius: 5px;
    }
  }
}

button.btn-submit,
button.btn-delete {
  width: 125px;
  height: 36px;
  border-radius: 2px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #ffffff;
}
button.btn-submit {
  background: #3a89ff;
}
button.btn-delete {
  background: #dc3545;
}

.btn-submit:hover {
  color: #ffffff !important;
  background: #337ae4 !important;
}
.btn-delete:hover {
  color: #ffffff !important;
  background-color: #c82333 !important;
}

#image-upload {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.btn-addImage {
  height: 30px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: 1px solid #dddddd !important;
  border-radius: 0 5px 5px 0 !important;
  border-left: 0 !important;
}
.link {
  font-size: 1.12em;
}
.pagination-container {
  display: flex;
  align-items: center;
}
.pagination {
  margin: 0 auto;
}
</style>
