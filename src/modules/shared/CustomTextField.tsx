import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps
} from '@mui/material'
import { useEffect, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const CustomTextField = ({ value, ...props }: TextFieldProps) => {
  const [view, setView] = useState(false)

  useEffect(() => {
    if (value) setView(true)
    else setView(false)
  }, [value])

  const handleButton = () => {
    value = undefined
  }

  return (
    <TextField
      {...props}
      value={value}
      InputProps={{
        endAdornment: (
          <>
            {view && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleButton}
                  edge="end"
                >
                  {<HighlightOffIcon />}
                </IconButton>
              </InputAdornment>
            )}
          </>
        )
      }}
    />
  )
}

export default CustomTextField
