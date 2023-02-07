import { createTheme } from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily: ['Open Sans'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 'bold'
    }
  }
})

export default theme
