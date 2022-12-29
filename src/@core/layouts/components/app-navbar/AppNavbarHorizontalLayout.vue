<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <search-bar />
    </div>

    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-button class="mr-2" variant="outline-warning" v-if="!!userData.suplantation" @click="backToMyProfile"><feather-icon icon="ChevronLeftIcon"/> {{$t('Volver a mi perfil')}}</b-button>
      <locale />
      <dark-Toggler class="d-none d-lg-block" />
      <notification-dropdown />
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  BLink, BNavbarNav
} from 'bootstrap-vue'
import Bookmarks from './components/Bookmarks.vue'
import Locale from './components/Locale.vue'
import DarkToggler from './components/DarkToggler.vue'
import SearchBar from './components/SearchBar.vue'
import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import Cookies from 'js-cookie'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    Locale,
    DarkToggler,
    SearchBar,
    NotificationDropdown,
    UserDropdown
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      userData: 'getUserData'
    })
  },
  watch: {
    userData: {
      handler (curr) {
      },
      deep: true
    }
  },
  methods: {
    backToMyProfile () {
      this.$session.set('cas_user', this.$session.get('ori_user'))
      Cookies.remove('session')
      this.$store.dispatch('fetchUserData', {id: JSON.parse(atob(Cookies.get('ori_session'))).id, from: 'back'})
      this.$session.set('ori_user', null)
      Cookies.remove('ori_session')
    }
  }

}
</script>
