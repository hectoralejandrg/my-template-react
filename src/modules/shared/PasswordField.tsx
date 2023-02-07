import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps
} from '@mui/material'
import { useEffect, useState } from 'react'

const PasswordField = ({ value, ...props }: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [view, setView] = useState(false)
  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  useEffect(() => {
    if (value) setView(true)
    else setView(false)
  }, [value])

  return (
    <TextField
      {...props}
      value={value}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <>
            {view && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )}
          </>
        )
      }}
    />
  )
}

export default PasswordField
