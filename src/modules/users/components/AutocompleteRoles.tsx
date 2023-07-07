import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material'
import { useGetRolesQuery } from '../slice/usersApiSlice'
import { Roles } from '../interfaces/roles.inteface'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps {
  inputLabel: string
  value?: Roles | null
  error?: boolean | undefined
  helperText?: string | false | undefined
  handleChange: (value: Roles | null) => void
}

const AutocompleteRoles = ({
  inputLabel,
  value,
  error,
  helperText,
  handleChange
}: CustomProps) => {
  const { data, isLoading } = useGetRolesQuery()
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Autocomplete
        options={data?.data || []}
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
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
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

export default AutocompleteRoles
