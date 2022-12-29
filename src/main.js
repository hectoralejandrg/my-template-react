import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import 'animate.css/animate.min.css'

import { i18n } from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'
import alerts from './utils/alerts'
import fx from './utils/fx'
import baseService from './utils/base.service'
import VueMask from 'v-mask'
import './utils/filters.js'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import es from 'vee-validate/dist/locale/es.json'
import * as rules from 'vee-validate/dist/rules'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { useUtils as useAclUtils } from '@core/libs/acl'

import * as globals from '@/utils/globals'
// import { getTimeZones, rawTimeZones, timeZonesNames } from '@vvo/tzdb'
// eslint-disable-next-line no-undef
const { t } = useI18nUtils()
const { canViewVerticalNavMenuGroup } = useAclUtils()

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})
extend('required', {
  validate(value) {
    return {
      required: true,
      valid: (!Array.isArray(value) && typeof value !== 'object' && ['', null, undefined].indexOf(value) === -1) || (Array.isArray(value) && !!value?.length) || (typeof value === 'object' && !!Object.keys(value || {})?.length)
    }
  },
  computesRequired: true,
  message: 'Este campo es requerido'
})

extend('dni', {
  validate(value, args) {
    switch (args.country.toLowerCase()) {
    case 'cl':
      return globals.validateRut(value)
    case 'pe':
      return globals.validateRuc(value)
    default:
      return true
    }
  },
  params: ['country'],
  message: 'No es válido o el formato es incorrecto'
})

localize('es', es)

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

alerts(Vue)
baseService(Vue)
fx(Vue)
Vue.use(VueMask)
Vue.filter(VueMask)


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// import VeeValidate from 'vee-validate'
// import es from 'vee-validate/dist/locale/es'
// Vue.use(VeeValidate, {dictionary:es})
// Vue.use(VeeValidate)
// Validator.localize('es', {...es,
//   messages: {
//     required: 'Este campo es requerido',
//     min: (_, min) => `este campo debe tener al menos ${min} caracteres`,
//     max: (_, max) => `este campo debe tener máximo ${max} caracteres`,
//     is: 'Los campos no coinciden',
//     email: 'El campo no contiene un e-mail válido',
//     length: (_, args) => {
//       if (args[2]) {
//         return args[2]
//       } else if (!args[0]) {
//         return 'Debe seleccionar al menos una opción'
//       } else if (args[0]) {
//         if (!args[1] || (args[1] && args[1] === args[0])) {
//           return `Debe seleccionar ${parseInt(args[0]) === 1 ? 'sólo ' : ''}${args[0]} elemento${parseInt(args[0]) === 1 ? '' : 's'}`
//         } else {
//           return `Debe seleccionar entre ${args[0]} y ${args[1]} opciones`
//         }
//       }
//     }
//   }
// })

// Validator.extend('beBoolean', {
//   getMessage: (_, args) => args[1],
//   validate: (value, args) => value === (args[0] === 'true')
// })

//Vc-calendar
import VCalendar from 'v-calendar'
Vue.use(VCalendar)

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'
import VueSession from 'vue-session'
Vue.use(VueSession)

// Axios Mock Adapter
import '@/@fake-db/db'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)
// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard
// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

// import Library Tour
import VueTour from 'vue-tour'
require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)

Vue.config.productionTip = false
import {
  functions,
  fb,
  db,
  auth,
  accountsCollection,
  notificationsCollection,
  resourcesPermissionsCollection,
  incFB,
  newA,
  removeA
} from './firebase'

let app = null
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      i18n,
      t,
      canViewVerticalNavMenuGroup,
      data: {accountsCollection, notificationsCollection, resourcesPermissionsCollection, incFB, newA, removeA, auth, fb, db, functions},
      render: h => h(App)
    }).$mount('#app')
  }
  if (user) {
    // store.dispatch('fetchUserData', user)
  }
})
