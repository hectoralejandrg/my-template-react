<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view/>
    </component>
    <scroll-to-top v-if="enableScrollToTop" />
    <modular-permissions/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'
import Cookies from 'js-cookie'

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'
import { provideToast } from 'vue-toastification/composition'
import { watch } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'

import { useWindowSize, useCssVar } from '@vueuse/core'

import store from '@/store'
import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {

    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,

    ScrollToTop
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
    ...mapGetters({
      userData: 'getUserData',
      userAlerts: 'getUserAlerts',
      iniUser: 'getIniUser',
      abilityUser: 'getAbilityUser',
      message: 'getMessage'
    })
  },
  watch: {
    message: {
      handler () {
        this[`$${this.message.type || 'alert'}`](this.$t(this.message.text, {code: this.message.code}))
      },
      deep: true
    },
    userAlerts (curr) {
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {...curr}
      })
    },
    abilityUser (curr, prev) {
      this.$ability.update(curr)
    },
    iniUser: {
      handler(curr, prev) {
        if (!!curr) {
          this.$i18n.locale = 'cl'
          this.$session.start()
          const userToSave = this.getUserToSave(curr)
          const objExpires = { expires: 1000, sameSite: 'None' }// !userToSave.remember ? { expires: ((1 / 24) * 8) } : { expires: 30 }
          // useJwt.setCookie('session', window.btoa(JSON.stringify(userToSave)), (!userToSave.remember ? ((1 / 24) * 8) : 30))
          Cookies.set('session', window.btoa(JSON.stringify(userToSave)), objExpires)
          Cookies.set('session_id', `${curr.id}##${curr.token}`, objExpires)
          localStorage.setItem('session_id', `${curr.id}##${curr.token}`)
          Cookies.set('permissions', window.btoa(JSON.stringify(curr.permissions)), objExpires)
          this.$session.set('cas_user', userToSave)
          this.$session.set('permissions', curr.permissions)
          this.$store.dispatch('fetchSession', userToSave)
          this.$ability.update(curr.ability)
          if (curr.from !== 'app' && curr.from !== 'external') this.$router.replace(getHomeRouteForLoggedInUser(curr.role))
        }
      },
      deep: true
    },
    userData : {
      handler (curr, prev) {
        const userToSave = this.getUserToSave(curr)
        this.$session.set('cas_user', userToSave)
        this.$session.set('permissions', curr.permissions)
        this.$store.dispatch('fetchSession', userToSave)
        const objExpires = { expires: 1000, sameSite: 'None' }// !userToSave.remember ? { expires: ((1 / 24) * 8) } : { expires: 30 }
        // useJwt.setCookie('session', window.btoa(JSON.stringify(userToSave)), (!userToSave.remember ? ((1 / 24) * 8) : 30))
        Cookies.set('session', window.btoa(JSON.stringify(userToSave)), objExpires)
        Cookies.set('session_id', `${curr.id}##${curr.token}`, objExpires)

        localStorage.setItem('session_id', `${curr.id}##${curr.token}`)

        Cookies.set('permissions', window.btoa(JSON.stringify(curr.permissions)), objExpires)
        this.$ability.update(curr.ability)
        // const objExpires = !this.$session.get('cas_user').remember ? { expires: ((1 / 24) * 8) } : { expires: 30 }
        // useJwt.setCookie('session', window.btoa(JSON.stringify(curr)), (!curr.remember ? ((1 / 24) * 8) : 30))
      },
      deep: true
    }
    
  },
  beforeCreate() {
    if (!this.$session.get('cas_user') && localStorage.getItem('session_id')) {
      console.log('Debe reiniciar sesión')
      if (!this.$router.history?.current?.meta?.external) {
        setTimeout(() => {
          if (!this.$router.history?.current?.meta?.external) {
            const cookie = localStorage.getItem('session_id').split('##') // Cookies.get('session_id').split('##')
            this.$store.dispatch('fetchUserData', {id: cookie[0], token: cookie[1], from: 'app'})
          }
        }, 200)
      }
    } else if (this.$session.get('cas_user')) {
      console.log('Sigue teniendo sesión') //  this.$session.get('cas_user')
      setTimeout(() => {
        if (!this.$router.history?.current?.meta?.external) {
          const casUser = this.$session.get('cas_user')
          if (!this.$session.get('cas_user').permissions) {
            this.$store.dispatch('fetchUserData', {...this.$session.get('cas_user'), from: 'app'})
          } else {
            this.$store.dispatch('fetchPermissions', { user: {...this.$session.get('cas_user'), from: 'app'} })
          }
        }
      }, 200)
    } else {
      Cookies.remove('session')
      Cookies.remove('session_id')
      Cookies.remove('permissions')

      localStorage.removeItem('session_id')
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

      localStorage.removeItem('userData')
      this.$session.destroy()

      this.$ability.update(initialAbility)

      localStorage.removeItem('accessToken')
    }
    /*

      Todo este código es especificamente para persistencia de sesión en los siguientes casos
      - Cambiar o abrir nueva pestaña
      - Actualizar el sitio
      - Cargar madagascar en platform

      Esto debiese ELIMINARSE y generar algun servicio de backend que controle la sesión y 
      poder consultar mediante la ID de firestore si corresponde recargar su sesión o matarla

      */
    // Set colors in theme
    // let boolValid = false
    // let boolInvalid = false
    // if (!!this.$session.get('ori_user')) {
    //   // Cookies.set('ori_session', btoa(JSON.stringify(this.$session.get('ori_user'))))
    //   // Si la cookie no existe, pero la sesión si
    // }
    // if (!!this.$session.get('cas_user')) {
    //   // Si la cookie no existe, pero la sesión si
    //   boolValid = true
    // } else if (!!Cookies.get('session') && atob(Cookies.get('session')) !== 'undefined') {
    //   // Si existe aun la cookie, reinicio la sesión con esos datos
    //   this.$session.set('cas_user', JSON.parse(atob(Cookies.get('session'))))
    //   boolValid = true
    // } else {
    //   const myData = JSON.parse(localStorage.getItem('userData'))
    //   if (myData) {
    //     this.$session.set('cas_user', myData)
    //     boolValid = true
    //   } else {
    //     boolInvalid = true
    //   }
    // }

    // if (boolValid) {
    //   const objExpires = { expires: 1000 }// !this.$session.get('cas_user').remember ? { expires: ((1 / 24) * 8) } : { expires: 30 }
    //   Cookies.set('session', btoa(JSON.stringify(this.$session.get('cas_user'))), objExpires)
    //   if (!this.$session.get('cas_user').permissions) {
    //     setTimeout(() => {
    //       if (!this.$router.history?.current?.meta?.external) this.$store.dispatch('fetchUserData', {...this.$session.get('cas_user'), from: 'app'})
    //     }, 200)
    //   } else if (!this.$router.history?.current?.meta?.external) {
    //     setTimeout(() => {
    //       this.$store.dispatch('fetchGlobalData', { user: this.$session.get('cas_user') })
    //     }, 200)
    //   }
    //   // localStorage.setItem('userData', this.$session.get('cas_user'))
    //   // this.$store.commit('setUserData', {...this.$session.get('cas_user')})
    // }

    // if (boolInvalid) {
    //   Cookies.remove('session')
    //   Cookies.remove('permissions')
    //   localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
    //   localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
    //   // Remove userData from localStorage
    //   localStorage.removeItem('userData')
    //   this.$session.destroy()
    //   // Reset ability
    //   this.$ability.update(initialAbility)
    //   // Redirect to login page
    //   // this.$router.push({ name: 'auth-login' })
    //   localStorage.removeItem('userData')
    //   localStorage.removeItem('accessToken')
    // }

    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  },
  setup() {
    const { skin, skinClasses } = useAppConfig()
    const { enableScrollToTop } = $themeConfig.layout

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade'
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    return {
      skinClasses,
      enableScrollToTop
    }
  },
  methods: {
    getUserToSave (data) {
      return {
        id: data.id,
        avatar: data.avatar,
        fullName: data.fullName,
        first_name: data.first_name,
        last_name: data.last_name,
        date_format: data.date_format,
        timezone: data.timezone,
        email: data.email,
        organization: data.organization,
        shipper: data.shipper || {},
        country: data.country,
        remember: data.remember,
        role: data.role,
        token: data.token,
        permissions: data.permissions,
        special_permissions: data.legacy_data?.special_functions ?? []
      }
    }
  }
}
</script>
