import { RouteObject } from 'react-router'
import { HomeLayout } from '../layouts/AuthLayout/HomeLayout'
import { Navigate } from 'react-router-dom'
import { ProtectedLayout } from '../layouts/AuthLayout/ProtectedLayout'
import SidebarLayout from '../layouts/SidebarLayout/Sidebar'
import LoginPage from '../modules/auth/login/page'
import { lazy, Suspense } from 'react'
import SuspenseLoader from '../layouts/AuthLayout/SuspenseLoader'

// eslint-disable-next-line
const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  )

const PageRecovery = Loader(lazy(() => import('../modules/auth/recovery/page')))
const PageResetPassword = Loader(lazy(() => import('../modules/auth/recovery/page/resetPassword')))
// const Authentication = Loader(lazy(() => import('./modules/auth/login/page')))
const PageTracking = Loader(lazy(() => import('../modules/tracking/pages')))
const PageDeliveries = Loader(lazy(() => import('../modules/deliveries/pages')))
const PageSummaries = Loader(lazy(() => import('../modules/summaries/pages')))
const PageUsers = Loader(lazy(() => import('../modules/users/pages')))

const routes: RouteObject[] = [
  {
    path: '*',
    element: <HomeLayout />,
    children: [
      { path: '', element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'recovery-password', element: <PageRecovery /> },
      { path: 'reset-password', element: <PageResetPassword /> }
    ]
  },
  {
    path: '',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <SidebarLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="/tracking" />
          },
          {
            path: 'tracking',
            element: <PageTracking />
          },
          {
            path: 'deliveries',
            element: <PageDeliveries />
          },
          {
            path: 'summaries',
            element: <PageSummaries />
          },
          {
            path: 'users',
            element: <PageUsers />
          }
        ]
      }
    ]
  }
]

export default routes
