import { SelectProps } from '@mui/material'
import { useGetRolesQuery } from '../slice/usersApiSlice'
import SelectGeneric from '../../shared/SelectGeneric'
import { useAppSelector } from '../../../store/useRedux'
import { useEffect, useState } from 'react'
import { Roles } from '../interfaces/roles.inteface'

const SelectRoles = ({ ...props }: SelectProps) => {
  const { roleId } = useAppSelector((state) => state.auth)
  const [roles, setRoles] = useState<Roles[] | undefined>([])
  const { data } = useGetRolesQuery()

  useEffect(() => {
    setRoles(data?.data?.filter((rol) => rol?.id !== 4))
    if (roleId === 4) {
      setRoles(data?.data?.filter((rol) => rol?.id !== 1 && rol?.id !== 3))
    }
  }, [data])

  return (
    <SelectGeneric
      data={roles}
      inputLabel="Roles"
      keyValue={'id'}
      keyId={'id'}
      keyName={'name'}
      {...props}
    />
  )
}

export default SelectRoles
