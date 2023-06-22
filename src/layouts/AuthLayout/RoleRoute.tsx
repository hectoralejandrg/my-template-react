import React from 'react'
import { useAppSelector } from '../../store/useRedux'
import { Navigate } from 'react-router-dom'
interface Props {
  roles: number[]
  component: React.ReactNode
}
const RoleRoute = ({ roles, component }: Props) => {
  const { profile } = useAppSelector((state) => state.auth)
  return profile?.role && roles?.includes(profile?.role?.id) ? (
    <>{component}</>
  ) : (
    <Navigate to={'/unauthorized'}/>
  )
}

export default RoleRoute
