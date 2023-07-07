import { CssBaseline, ThemeProvider } from '@mui/material'
import routes from './routes/routes'
import { useRoutes } from 'react-router-dom'
import theme from './theme'
import Notification from './modules/shared/Notification'

function App () {
  const content = useRoutes(routes)
  return (
    <>
      <ThemeProvider theme={theme}>
        <Notification />
        <CssBaseline />
        {content}
      </ThemeProvider>
    </>
  )
}

export default App
