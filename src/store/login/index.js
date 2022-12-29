
import * as fb from '@/firebase'
import useJwt from '@/auth/jwt/useJwt'
import { initialAbility } from '@/libs/acl/config'

export default {
  state: {
    userData: {},
    userAlerts: {},
    iniUser: {},
    abilityUser: {},
    relevantEntities: {}
  },
  getters: {
    getUserData: state => state.userData,
    getUserDataOriginal: state => state.userDataOriginal,
    getUserAlerts: state => state.userAlerts,
    getIniUser: state => state.iniUser,
    getAbilityUser: state => state.abilityUser,
    getRelevantEntities: state => state.relevantEntities
  },
  mutations: {
    setRelevantEntities(state, val) {
      state.relevantEntities = val
    },
    setUserData(state, val) {
      state.userData = {...val}
      localStorage.setItem('userData', JSON.stringify(val))
    },
    setUserAlerts(state, val) {
      state.userAlerts = {...val}
    },
    setIniUser(state, val) {
      state.iniUser = {...val}
      state.userData = {...val}
      localStorage.setItem('userData', JSON.stringify(val))
    },
    setAbilityUser(state, val) {
      state.abilityUser = [...val]
      localStorage.setItem('abilityUser', JSON.stringify(val))
    }
  },
  actions: {
    fetchItemUserData ({ commit, state }, {element, value}) {
      const user = state.userData
      user[element] = value
      commit('setUserData', user)
    },
    fetchUserData({ commit, state, dispatch }, {id, remember = false, token, from, onSuccess}) {
      commit('setLoading', { name: 'getGlobalData', status: true })
      document.getElementById('loading-bg').style.display = 'block'
      const appLoading = document.getElementById('loading-text')
      appLoading.innerHTML = 'Obteniendo datos del usuario'
      fb.accountsCollection.doc(id).get()
        .then((doc) => {
          if (doc.exists) {
            const user = {
              ...doc.data(),
              id,
              token,
              remember: !!remember,
              suplantation: from === 'users',
              from
            }
            if (user.shipper) {
              user.shipper = {
                id: user.shipper.id,
                name1: user.shipper.name1 || user.shipper.name,
                name2: user.shipper.name2,
                code: user.shipper.code,
                api_key: user.shipper.api_key,
                show_cyber_form: user.shipper.show_cyber_form,
                show_invoices: user.shipper.show_invoices,
                country: user.shipper.country
              }
            }
            // fb.accountsCollection.doc(id).update({remember: !!remember})
            user.status = true
            if (user.status || state.userData.id) {
              if (!!state.userData) user.original = state.userData
              user.ability = [{action: 'manage', subject: 'Common'}]
              if (user.from === 'external') {
                user.theme = {
                  contentWidth: 'full',
                  footerType: 'hidden',
                  isNavMenuHidden: true,
                  isVerticalMenuCollapsed: true,
                  layoutType: 'horizontal',
                  navbarType: 'hidden',
                  routerTransition: 'zoom-fade',
                  skin: 'light'
                }
              }
              if (user.theme) {
                commit('appConfig/UPDATE_SKIN', user.theme.skin)
                commit('appConfig/UPDATE_ROUTER_TRANSITION', user.theme.routerTransition)
                commit('appConfig/UPDATE_LAYOUT_TYPE', user.theme.layoutType)
                commit('appConfig/UPDATE_CONTENT_WIDTH', user.theme.contentWidth)
                commit('appConfig/UPDATE_NAV_MENU_HIDDEN', user.theme.isNavMenuHidden)
                commit('appConfig/UPDATE_NAVBAR_CONFIG', { type: user.theme.navbarType })
                commit('appConfig/UPDATE_FOOTER_CONFIG', { type: user.theme.footerType })
                commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', user.theme.isVerticalMenuCollapsed)
              }
              if (from !== 'back') {
                dispatch('fetchPermissions', {user, onSuccess})
              } else {
                location.href = '/'
              }
            } else if (from !== 'external') {
              commit('setUserAlerts', { icon: 'SlashIcon', variant: 'danger', text: 'Tu cuenta no está activada', title: 'Problema con tu cuenta', status: 'error' })
              commit('setIniUser', null)
            }
          } else {
            localStorage.removeItem('userData')
            localStorage.removeItem('session_id')
            location.href = '/'
          }
        })
        .catch(err => {
          commit('setLoading', { name: 'getGlobalData', status: false })
          localStorage.removeItem('userData')
          localStorage.removeItem('session_id')
          console.error(err)
        })
    },
    fetchLogout({ commit }, data) {
      // // Remove userData from localStorage
      // // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      // localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      // localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

      // // Cookies.remove('session')
      // // Cookies.remove('session_id')
      // // Cookies.remove('ori_session')
      // // Remove userData from localStorage
      // localStorage.removeItem('userData')
      // localStorage.removeItem('session_id')
      // // this.$session.destroy()
      // // Reset ability
      // // this.$ability.update(initialAbility)
      // location.href = '/'
    }
  }
}
