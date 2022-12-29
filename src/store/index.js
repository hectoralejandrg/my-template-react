import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// Modules
import * as fb from '@/firebase'
//import ecommerceStoreModule from '@/views/apps/e-commerce/eCommerceStoreModule'
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import login from './login'
import global from './global'
import notifications from './notifications'
import organizations from './organizations'
import deliveries from './deliveries'
import integrations from './integrations'
import ratesQuoter from './ratesQuoter'
import * as fx from './notifications/fx'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    login,
    global,
    notifications,
    //'app-ecommerce': ecommerceStoreModule,
    organizations,
    deliveries,
    integrations,
    ratesQuoter
  },
  strict: process.env.DEV
})

fb.notificationsCollection.onSnapshot(snapshot => {
  const notificationsArray = fx.parseRows(snapshot.docs)
  store.commit('setNotifications', notificationsArray)
  store.commit('setNotificationsRead', fx.getNotificationsRead(notificationsArray))
})

export default store
