import { SelectProps } from '@mui/material'
import SelectGeneric from '../../shared/SelectGeneric'
import { useGetCompaniesQuery } from '../slice/usersApiSlice'

const SelectCompanies = ({ ...props }: SelectProps) => {
  const { data } = useGetCompaniesQuery()
  return (
    <SelectGeneric
      data={data}
      inputLabel="Compañía"
      keyValue={'id'}
      keyId={'id'}
      keyName={'name'}
      {...props}
    />
  )
}

export default SelectCompanies
