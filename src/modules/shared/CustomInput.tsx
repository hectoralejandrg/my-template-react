import {
  FormControl,
  InputLabel,
  TextField,
  TextFieldProps
} from '@mui/material'

const styleLabel = {
  'label + &': {
    marginTop: 3
  }
}

interface CustomProps {
  inputLabel?: String
}

type TextFieldCustom = TextFieldProps & CustomProps

const CustomInput = ({ inputLabel, ...props }: TextFieldCustom) => {
  return (
    <FormControl variant="standard" fullWidth>
      {inputLabel && (
        <InputLabel shrink sx={{ fontSize: 20 }}>
          {inputLabel}
        </InputLabel>
      )}
      <TextField sx={styleLabel} size="small" {...props} />
    </FormControl>
  )
}

export default CustomInput
