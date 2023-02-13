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

// const Authentication = Loader(lazy(() => import('./modules/auth/login/page')))
const PageTracking = Loader(lazy(() => import('../modules/tracking/page')))
const PageDeliveries = Loader(lazy(() => import('../modules/deliveries/page')))

const routes: RouteObject[] = [
  {
    path: '*',
    element: <HomeLayout />,
    children: [
      { path: '', element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> }
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
          }
        ]
      }
    ]
  }
]

export default routes
