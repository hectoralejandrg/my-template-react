import React from 'react'
import { useGetStatusesQuery } from '../slice/trackingApiSlice'
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material'
import { Status } from '../interfaces/statusses.interface'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps {
  inputLabel: string
  value?: Status | null
  error?: boolean | undefined
  helperText?: string | false | undefined
  handleChange: (value: Status | null) => void
}

const StatusAutocomplete = ({
  inputLabel,
  value,
  error,
  helperText,
  handleChange
}: CustomProps) => {
  const { data, isLoading } = useGetStatusesQuery()
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Autocomplete
        value={value}
        sx={styleLabel}
        onChange={(_, newValue) => handleChange(newValue)}
        getOptionLabel={(option) => option?.name}
        options={data?.statuses ?? []}
        loading={isLoading}
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

export default StatusAutocomplete
