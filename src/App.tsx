import { CssBaseline, ThemeProvider } from '@mui/material'
// import AdapterDateFns from '@mui/lab/AdapterDateFns'
import routes from './routes'
import { useRoutes } from 'react-router-dom'
import theme from './theme'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App () {
  const content = useRoutes(routes)
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {content}
      </ThemeProvider>
    </>
  )
}

export default App
