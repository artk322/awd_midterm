import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import axios from 'axios';

Vue.use(VueRouter);

const routes = [
  { path: '*', component: () => import('@/components/NotFoundComponent.vue') },
  {
    path: '/',
    name: 'home',
    meta: { layout: 'default' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    meta: { layout: 'catalog' },
    component: () => import('@/views/Catalog.vue'),
  },
  {
    path: '/create-post',
    name: 'create-post',
    meta: { layout: 'default', requiresAuth: true },
    component: () => import('@/views/Create.vue'),
  },
  {
    path: '/edit-post/:id',
    name: 'edit-post',
    meta: { layout: 'default', requiresAuth: true },
    component: () => import('@/views/Edit.vue'),
  },
  {
    path: '/post/:id',
    name: 'post',
    meta: { layout: 'catalog' },
    component: () => import('@/views/Post.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { layout: 'default', requiresAuth: true },
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'default', noAuth: true },
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: { layout: 'default', noAuth: true },
    component: () => import('@/views/ForgotPassword.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { layout: 'default', noAuth: true },
    component: () => import('@/views/Signup.vue'),
  },
  {
    path: '/verify/:token',
    name: 'verify',
    meta: { layout: 'default', noAuth: true },
    component: () => import('@/views/Verify.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requiresAuth);
  const noAuth = to.matched.some(record => record.meta.noAuth);
  const homePage = to.matched.some(record => record.name == 'home');

  const jwt = localStorage.getItem('jwt') || null;
  if (requireAuth) {
    if (!jwt) {
      next('/login');
      store.commit('setMessage', { message: 'Пожалуйста войдите', type: 'default' });
    } else {
      await axios
        .post(`${window.location.origin}/api/token`, null, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then(response => {
          store.commit('setUserData', response.data);
          next();
        })
        .catch(error => {
          store.commit('setMessage', { type: 'error', message: error.response.data.message });
          store.commit('clearUserData');
          next('/login');
        });
    }
  } else if (jwt && noAuth) {
    next('/catalog');
    store.commit('setMessage', { type: 'default', message: 'Вы уже в системе, обновите страницу' });
  } else if (homePage) {
    next('/catalog');
  } else {
    next();
  }
});

export default router;
