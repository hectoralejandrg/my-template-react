<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{ myData.fullName || myData.username || `${myData.first_name} ${myData.last_name}` }}
        </p>
        <span class="user-status">{{ $options.filters.title(myData.role) }}</span>
      </div>
      <b-avatar
        size="40"
        :src="myData.avatar"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon
          v-if="!myData.fullName"
          icon="UserIcon"
          size="22"
        />
      </b-avatar>
    </template>

    <b-dropdown-item
      :to="{ name: 'profile'}"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50"
      />
      <span>{{$t('Perfil')}}</span>
    </b-dropdown-item>
    <!--b-dropdown-item
      :to="{ name: 'apps-email' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="MailIcon"
        class="mr-50"
      />
      <span>Inbox</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'apps-todo' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="CheckSquareIcon"
        class="mr-50"
      />
      <span>Task</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'apps-chat' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="MessageSquareIcon"
        class="mr-50"
      />
      <span>Chat</span>
    </b-dropdown-item-->

    <b-dropdown-divider />

    <!--b-dropdown-item
      :to="{ name: 'pages-account-setting' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="SettingsIcon"
        class="mr-50"
      />
      <span>Settings</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'pages-pricing' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="CreditCardIcon"
        class="mr-50"
      />
      <span>Pricing</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'pages-faq' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="HelpCircleIcon"
        class="mr-50"
      />
      <span>FAQ</span>
    </b-dropdown-item-->
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>{{$t('Cerrar sesión')}}</span>
    </b-dropdown-item></b-nav-item-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import {
  BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import { initialAbility } from '@/libs/acl/config'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar
  },
  data() {
    return {
      myData: this.$session.get('cas_user') || {},
      avatarText
    }
  },
  watch: {
    userData: {
      handler () {
        this.myData = this.userData
      },
      deep: true
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    ...mapGetters({
      userData: 'getUserData'
    })
  },
  methods: {
    logout() {
      this.$root.$data.auth.signOut()
        .then(resp => {
          Cookies.remove('session_id')
          console.log(resp)
        })
      this.$store.dispatch('fetchLogout')
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

      // Cookies.remove('session')
      // Cookies.remove('ori_session')
      // Remove userData from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem('session_id')
      this.$session.destroy()
      // Reset ability
      this.$ability.update(initialAbility)
      location.href = '/'
      // Redirect to login page
      // this.$router.push({ name: 'auth-login' })
    }
  }
}
</script>
