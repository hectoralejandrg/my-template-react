import { SelectProps } from '@mui/material'
import { useGetRolesQuery } from '../slice/usersApiSlice'
import SelectGeneric from '../../shared/SelectGeneric'

const SelectRoles = ({ ...props }: SelectProps) => {
  const { data } = useGetRolesQuery()
  return (
    <SelectGeneric
      data={data?.data}
      inputLabel="Roles"
      keyValue={'id'}
      keyId={'id'}
      keyName={'name'}
      {...props}
    />
  )
}

export default SelectRoles
