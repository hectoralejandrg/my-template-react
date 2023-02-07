import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../store/useRedux'

export const HomeLayout = () => {
  const { token } = useAppSelector((state) => state.auth)

  if (token) {
    return <Navigate to="/dashboard" />
  }

  return <Outlet />
}
