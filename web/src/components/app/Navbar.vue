<template>
  <nav class="navbar navbar-expand-lg navbar-dark nav-theme">
    <div class="container">
      <router-link class="navbar-brand mr-0 py-0" to="/">
        <!-- <span class="logo">Zher E-Batys</span> -->
        <img class="logoImage" src="@/assets/static/images/logo.svg" alt="" />
      </router-link>
      <button
        class="btn navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <form
          v-if="this.$route.meta.layout === 'catalog'"
          class="form-inline ml-lg-4 mt-2 mb-3 my-lg-0 mr-auto"
        >
          <input
            id="search-input"
            v-model.trim="searchString"
            class="post_form-control"
            title="Поиск по всем участкам"
            autocomplete="off"
            @input="toSearch(searchString)"
            @keydown.enter.prevent
          />
          <i class="icon search"></i>
        </form>
        <ul class="navbar-nav ml-lg-auto">
          <router-link
            v-if="this.$route.name !== 'create-post'"
            tag="li"
            class="nav-item btn-add mr-lg-2"
            to="/create-post"
          >
            <a class="nav-link">
              <span class="icon add">Добавить участок</span>
            </a>
          </router-link>
          <router-link
            v-if="this.$route.meta.layout !== 'catalog'"
            tag="li"
            class="nav-item mx-lg-2"
            to="/catalog"
          >
            <a class="nav-link" title="Земельные участки">Земельные участки</a>
          </router-link>
          <li v-if="Object.keys(user).length" class="dropdown ml-lg-2">
            <a
              id="navbarDropdownMenuLink"
              class="nav-link profile"
              href
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ user.name }}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <router-link to="/profile" class="dropdown-item">
                Личный кабинет
              </router-link>
              <a class="dropdown-item" href @click.prevent="logout">Выйти</a>
            </div>
          </li>
          <li v-else class="nav-item ml-lg-2">
            <router-link to="/login" class="nav-link pr-0">
              Войти
            </router-link>
          </li>
        </ul>
      </div>
      <!--Supported content-->
    </div>
    <!--container-->
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    searchString: '',
  }),
  computed: {
    message() {
      return this.$store.getters.message;
    },
    user() {
      return this.$store.getters.userData || {};
    },
  },
  async mounted() {},
  methods: {
    async logout() {
      await this.$store.dispatch('logout');
      if (this.message.type !== 'error') {
        this.$router.push('/login');
      }
    },
    toSearch(value) {
      this.$store.commit('toSearch', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-theme {
  background-color: #222222 !important;
  color: #ffffff !important;
}
.navbar {
  margin-bottom: 20px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: inline-flex;
  align-items: center;
}

.nav-link {
  position: relative;
  display: flex !important;
  align-items: center;
}

.logo {
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 21px;
  color: #ffffff;
}

.logoImage {
  width: 40px;
  height: 40px;
}

a.navbar-brand {
  display: flex;
}
.navbar a.nav-link {
  color: #ffffff !important;
  font-style: normal;
  font-weight: 500;
  font-family: Roboto, sans-serif;
}
a.nav-link:hover {
  color: #f4dc00 !important;
}
.navbar-expand-lg > .container {
  padding-left: 15px;
  padding-right: 15px;
}
#search-input.post_form-control {
  padding: 0.375rem 0.5rem 0.375rem 2.5rem !important;
  width: 22.5rem;
  min-width: 15.5rem;
  height: 36px !important;
}

.btn-add {
  a {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #3f3f3f;
    border: 1px solid #555555;
    border-radius: 2px;
    padding: 6px 10px !important;
    text-align: center;
    span {
      display: flex;
      align-items: center;
    }
  }
}

.icon.add::before {
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M13.2402 6.0242H7.97672V0.760664C7.97672 0.520889 7.65113 0.000976562 6.99997 0.000976562C6.34881 0.000976562 6.02322 0.520917 6.02322 0.760664V6.02423H0.759688C0.519941 6.0242 0 6.34979 0 7.00092C0 7.65205 0.519941 7.97767 0.759688 7.97767H6.02325V13.2412C6.02325 13.481 6.34881 14.0009 7 14.0009C7.65119 14.0009 7.97675 13.481 7.97675 13.2412V7.97767H13.2403C13.48 7.97767 14 7.65211 14 7.00092C14 6.34973 13.48 6.0242 13.2402 6.0242Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='14' height='14' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 10px;
}

.btn-add {
  .nav-link:hover {
    .icon.add::before {
      background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M13.2402 6.0242H7.97672V0.760664C7.97672 0.520889 7.65113 0.000976562 6.99997 0.000976562C6.34881 0.000976562 6.02322 0.520917 6.02322 0.760664V6.02423H0.759688C0.519941 6.0242 0 6.34979 0 7.00092C0 7.65205 0.519941 7.97767 0.759688 7.97767H6.02325V13.2412C6.02325 13.481 6.34881 14.0009 7 14.0009C7.65119 14.0009 7.97675 13.481 7.97675 13.2412V7.97767H13.2403C13.48 7.97767 14 7.65211 14 7.00092C14 6.34973 13.48 6.0242 13.2402 6.0242Z' fill='%23F4DC00'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='14' height='14' fill='%23F4DC00'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
  }
}

.sidebar-content {
  display: none;
}

.profile::before {
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.9498 9.05023C11.1873 8.28784 10.2799 7.72343 9.28974 7.38177C10.3502 6.65139 11.0469 5.42905 11.0469 4.04688C11.0469 1.81543 9.23144 0 7 0C4.76856 0 2.95312 1.81543 2.95312 4.04688C2.95312 5.42905 3.64982 6.65139 4.71029 7.38177C3.72017 7.72343 2.81269 8.28784 2.05026 9.05023C0.728137 10.3724 0 12.1302 0 14H1.09375C1.09375 10.7433 3.74328 8.09375 7 8.09375C10.2567 8.09375 12.9062 10.7433 12.9062 14H14C14 12.1302 13.2719 10.3724 11.9498 9.05023ZM7 7C5.37165 7 4.04688 5.67525 4.04688 4.04688C4.04688 2.4185 5.37165 1.09375 7 1.09375C8.62835 1.09375 9.95312 2.4185 9.95312 4.04688C9.95312 5.67525 8.62835 7 7 7Z' fill='white'/%3E%3C/svg%3E%0A");
  content: '';
  display: block;
  margin-right: 8px;
  height: 14px;
  width: 14px;
}

.profile::after {
  background-image: url("data:image/svg+xml,%3Csvg width='9' height='5' viewBox='0 0 9 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.67647 4.93032L8.96229 0.252903C9.0075 0.203387 9.01222 0.139194 8.97557 0.0862903C8.9385 0.0332258 8.86564 -5.8729e-09 8.78593 -9.35741e-09L0.214291 -3.84036e-07C0.134574 -3.8752e-07 0.0615015 0.0332254 0.0244293 0.0862899C0.00814342 0.109838 -5.92924e-09 0.135645 -7.05022e-09 0.16129C-8.45322e-09 0.193387 0.0128574 0.225322 0.0379295 0.252903L4.32375 4.93032C4.36382 4.97403 4.42961 5 4.50011 5C4.57061 5 4.6364 4.97387 4.67647 4.93032Z' fill='white'/%3E%3C/svg%3E%0A");
  content: '';
  display: block;
  height: 5px;
  width: 9px;
  margin-left: 8px;
}

a.nav-link:hover.profile::after {
  background-image: url("data:image/svg+xml,%3Csvg width='9' height='5' viewBox='0 0 9 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.67647 4.93032L8.96229 0.252903C9.0075 0.203387 9.01222 0.139194 8.97557 0.0862903C8.9385 0.0332258 8.86564 -5.8729e-09 8.78593 -9.35741e-09L0.214291 -3.84036e-07C0.134574 -3.8752e-07 0.0615015 0.0332254 0.0244293 0.0862899C0.00814342 0.109838 -5.92924e-09 0.135645 -7.05022e-09 0.16129C-8.45322e-09 0.193387 0.0128574 0.225322 0.0379295 0.252903L4.32375 4.93032C4.36382 4.97403 4.42961 5 4.50011 5C4.57061 5 4.6364 4.97387 4.67647 4.93032Z' fill='%23f4dc00'/%3E%3C/svg%3E%0A");
}

a.nav-link:hover.profile::before {
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.9498 9.05023C11.1873 8.28784 10.2799 7.72343 9.28974 7.38177C10.3502 6.65139 11.0469 5.42905 11.0469 4.04688C11.0469 1.81543 9.23144 0 7 0C4.76856 0 2.95312 1.81543 2.95312 4.04688C2.95312 5.42905 3.64982 6.65139 4.71029 7.38177C3.72017 7.72343 2.81269 8.28784 2.05026 9.05023C0.728137 10.3724 0 12.1302 0 14H1.09375C1.09375 10.7433 3.74328 8.09375 7 8.09375C10.2567 8.09375 12.9062 10.7433 12.9062 14H14C14 12.1302 13.2719 10.3724 11.9498 9.05023ZM7 7C5.37165 7 4.04688 5.67525 4.04688 4.04688C4.04688 2.4185 5.37165 1.09375 7 1.09375C8.62835 1.09375 9.95312 2.4185 9.95312 4.04688C9.95312 5.67525 8.62835 7 7 7Z' fill='%23f4dc00'/%3E%3C/svg%3E%0A");
}

.dropdown-menu {
  background: #ffffff !important;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2) !important;
  border-radius: 2px !important;
  border: none;
  padding: 0 !important;
}

.dropdown-item {
  padding: 9px 20px !important;
}

.dropdown-item:hover,
.dropdown-item:active {
  background-color: #252525 !important;
  color: #ffffff !important;
}

@media (min-width: 992px) {
  .btn-add > .nav-link {
    padding-right: 10px !important;
    padding-left: 10px !important;
  }
}
</style>
