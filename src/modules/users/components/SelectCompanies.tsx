import { SelectProps, Skeleton } from '@mui/material'
import SelectGeneric from '../../shared/SelectGeneric'
import { useGetCompaniesQuery } from '../slice/usersApiSlice'
import { Suspense } from 'react'

interface Props {
  helperText?: string | false
}

type CustomProps = Props & SelectProps

const SelectCompanies = ({ helperText, ...props }: CustomProps) => {
  const { data } = useGetCompaniesQuery()
  return (
    <Suspense fallback={<Skeleton variant="rectangular" width={210} height={60} />}>
      <SelectGeneric
        data={data?.companies}
        inputLabel="Compañía"
        keyValue={'id'}
        keyId={'id'}
        keyName={'name'}
        helperText={helperText}
        {...props}
      />
    </Suspense>
  )
}

export default SelectCompanies
