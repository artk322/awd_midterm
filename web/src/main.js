import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuelidate from 'vuelidate';
import VueToast from 'vue-toast-notification';
import dateFilter from '@/filters/date.filter';
import statusFilter from '@/filters/status.filter';
import { categoriesAbbr, categoriesFull } from '@/filters/categories.filter';
import Loader from '@/components/app/Loader';
import SubmitButton from '@/components/app/SubmitButton';

import './registerServiceWorker';
import 'vue-toast-notification/dist/theme-default.css';
import 'jquery';
import 'bootstrap';
import 'popper.js';

Vue.component('Loader', Loader);
Vue.component('SubmitButton', SubmitButton);
Vue.filter('date', dateFilter);
Vue.filter('status', statusFilter);
Vue.filter('categoriesAbbr', categoriesAbbr);
Vue.filter('categoriesFull', categoriesFull);
Vue.use(VueToast);
Vue.use(Vuelidate);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
