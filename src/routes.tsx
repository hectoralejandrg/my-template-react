import { RouteObject } from 'react-router'
import { HomeLayout } from './layouts/AuthLayout/HomeLayout'
import { Navigate } from 'react-router-dom'
import { ProtectedLayout } from './layouts/AuthLayout/ProtectedLayout'
import SidebarLayout from './layouts/SidebarLayout/Sidebar'
// import LoginPage from './modules/auth/login/page'
import SuspenseLoader from './layouts/AuthLayout/SuspenseLoader'
import { lazy, Suspense } from 'react'

// eslint-disable-next-line
const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  )

const Authentication = Loader(lazy(() => import('./modules/auth/login/page')))

const routes: RouteObject[] = [
  {
    path: '*',
    element: <HomeLayout />,
    children: [
      { path: '', element: <Navigate to="/login" replace /> },
      { path: 'login', element: <Authentication /> }
    ]
  },
  {
    path: '',
    element: <ProtectedLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" />
      },
      {
        path: 'dashboard',
        element: <SidebarLayout />
      }
    ]
  }
]

export default routes
