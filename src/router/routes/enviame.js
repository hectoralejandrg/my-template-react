export default [
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/modules/auth/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/modules/main/Dashboard.vue'),
    meta: {
      breadcrumb: [
        {
          text: 'Dashboard',
          active: true
        }
      ],
      resource: 'menu',
      action: 'dashboard'
    }
  }
]
