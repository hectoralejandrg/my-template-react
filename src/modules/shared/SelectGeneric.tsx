import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material'
const styleLabelSelect = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps<T> {
  data?: T[]
  inputLabel: string
  keyId: keyof T
  keyValue: keyof T
  keyName: keyof T
  helperText?: string | false
}

export type CustomPropsSelect<T> = CustomProps<T> & SelectProps

const SelectGeneric = <T extends unknown>({
  inputLabel,
  keyValue,
  keyId,
  keyName,
  data,
  helperText,
  ...props
}: CustomPropsSelect<T>) => {
  return (
    <FormControl variant="standard" fullWidth error={props.error}>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Select
        sx={styleLabelSelect}
        size="small"
        variant="outlined"
        defaultValue={''}
        {...props}
      >
        {data?.map((rol, index) => (
          <MenuItem key={`${rol[keyId]}-${index}`} value={`${rol[keyValue]}`}>
            {`${rol[keyName]}`}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

export default SelectGeneric
