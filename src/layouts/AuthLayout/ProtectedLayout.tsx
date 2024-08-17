import { Navigate, useOutlet } from 'react-router-dom'
import { useStateChange } from '../hooks/useStateChange'
// import SuspenseLoader from './SuspenseLoader'

export const ProtectedLayout = () => {
  const { token } = useStateChange()
  const outlet = useOutlet()

  // if (loading) return <SuspenseLoader />

  if (!token) return <Navigate to="/login" />

  return <>{outlet}</>
}
