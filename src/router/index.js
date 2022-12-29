import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import { loadLanguageAsync } from '@/libs/i18n'
import enviame from './routes/enviame'
// import apps from './routes/apps' !!!!Listo
// import dashboard from './routes/dashboard' !!!!Listo
// import uiElements from './routes/ui-elements/index' !!!!Listo
// import pages from './routes/pages' !!!!Listo
// import chartsMaps from './routes/charts-maps' !!!!Listo
// import formsTable from './routes/forms-tables' !!!!Listo
// import others from './routes/others' !!!!Listo

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '', redirect: { name: 'dashboard' } },
    { path: '/', redirect: { name: 'dashboard' } },
    // ...apps,
    // ...dashboard,
    // ...pages,
    // ...chartsMaps,
    // ...formsTable,
    // ...uiElements,
    // ...others,
    ...enviame,
    {
      path: '*',
      redirect: { name: 'error' }
    }
  ]
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  // const lang = to.params.lang
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' })

    // If logged in => not authorized
    return next({ name: 'forbidden' })
  }
  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  }
  loadLanguageAsync(to.name)
  // console.log('-----------------------------------------------------------------------------', {...to}, {..._}, next)
  // return loadLanguageAsync(to.name).then(() => next())
  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach((to, from, next) => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading && (!from || !from.name || from.name.indexOf('auth-') === -1)) {
    appLoading.style.display = 'none'
  }
})

export default router
