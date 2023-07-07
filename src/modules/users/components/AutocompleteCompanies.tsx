import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material'
import React from 'react'
import { Company } from '../interfaces/compnaies.inteface'
import { useGetCompaniesQuery } from '../../companies/slice/companiesApiSlice'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps {
  inputLabel: string
  value?: Company | null
  error?: boolean | undefined
  helperText?: string | false | undefined
  handleChange: (value: Company | null) => void
}

const AutocompleteCompanies = ({
  inputLabel,
  value,
  error,
  helperText,
  handleChange
}: CustomProps) => {
  const { data, isLoading } = useGetCompaniesQuery({ paginate: false })
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Autocomplete
        options={data?.companies?.data || []}
        loading={isLoading}
        value={value}
        sx={styleLabel}
        onChange={(_, newValue) => handleChange(newValue)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
            size="small"
            error={error}
            helperText={helperText}
          />
        )}
      />
    </FormControl>
  )
}

export default AutocompleteCompanies
