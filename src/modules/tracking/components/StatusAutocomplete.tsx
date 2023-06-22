import React from 'react'
import { useGetStatusesQuery } from '../slice/trackingApiSlice'
import {
  Autocomplete,
  CircularProgress,
  InputLabel,
  Skeleton,
  TextField
} from '@mui/material'
import { Status } from '../interfaces/statusses.interface'

interface CustomProps {
  inputLabel: string
  value: Status | null
  error: boolean | undefined
  helperText: string | false | undefined
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
  return data ? (
    <Autocomplete
      fullWidth
      value={value}
      onChange={(_, newValue) => handleChange(newValue)}
      //   sx={{ width: 300 }}
      //   open={open}
      //   onOpen={() => {
      //     setOpen(true)
      //   }}
      //   onClose={() => {
      //     setOpen(false)
      //   }}
      //   isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option?.name}
      options={data.statuses}
      loading={isLoading}
      renderInput={(params) => (
        <>
          <InputLabel shrink sx={{ fontSize: 20 }}>
            {inputLabel}
          </InputLabel>
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
        </>
      )}
    />
  ) : (
    <>
      <Skeleton variant="text" sx={{ fontSize: '1rem', marginBottom: -3 }} width={200}/>
      <Skeleton variant="rounded" width={'100%'} height={40} />
    </>
  )
}

export default StatusAutocomplete
