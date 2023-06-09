import {
  FormControl,
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
}

export type CustomPropsSelect<T> = CustomProps<T> & SelectProps

const SelectGeneric = <T extends unknown>({
  inputLabel,
  keyValue,
  keyId,
  keyName,
  data,
  ...props
}: CustomPropsSelect<T>) => {
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel shrink sx={{ fontSize: 20 }}>
        {inputLabel}
      </InputLabel>
      <Select sx={styleLabelSelect} size="small" variant="outlined" {...props}>
        {data?.map((rol, index) => (
          <MenuItem key={`${rol[keyId]}-${index}`} value={rol[keyValue]}>
            {rol[keyName]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectGeneric
