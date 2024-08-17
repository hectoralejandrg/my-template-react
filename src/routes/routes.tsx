import { RouteObject } from 'react-router'
import { HomeLayout } from '../layouts/AuthLayout/HomeLayout'
import { Navigate } from 'react-router-dom'
import LoginPage from '../modules/auth/login/page'
import { Suspense } from 'react'
import SuspenseLoader from '../layouts/AuthLayout/SuspenseLoader'
import ErrorPage from '../layouts/AuthLayout/ErrorPage'

// eslint-disable-next-line
const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  )

// const PageRecovery = Loader(lazy(() => import('../modules/auth/recovery/page')))

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
    path: 'unauthorized',
    element: <ErrorPage />
  }
]

export default routes

// const routes: RouteObject[] = [
//   {
//     // Home sin permiso, rutas publicas
//     path: '*',
//     element: <HomeLayout />,
//     children: [
//       { path: '', element: <Navigate to="/login" replace /> },
//       { path: 'login', element: <LoginPage /> }
//     ]
//   },
//   {
//     // rutas protegidas y con roles
//     path: '',
//     element: <ProtectedLayout />,
//     children: [
//       {
//         path: '',
//         element: <SidebarLayout />,
//         children: [
//           {
//             path: '',
//             element: <Navigate to="/tracking" />
//           },
//           {
//             path: 'summaries/deliveries/:id',
//             element: (
//               <RoleRoute
//                 roles={[1, 2, 3]}
//                 component={<PageDeliveriesDetails />}
//               />
//             )
//           }
//         ]
//       }
//     ]
//   },
//   {
//     path: 'unauthorized',
//     element: <ErrorPage />
//   }
// ]
