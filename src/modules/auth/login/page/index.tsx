import { Grid, styled, Typography } from '@mui/material'
import Login from '../componets/Login'

const LoginWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

const LoginPage = () => {
  return (
    <>
      <LoginWrapper>
        <Grid container justifyContent={'center'}>
          <Grid
            container
            item
            direction={{ md: 'column', sm: 'row' }}
            justifyContent={{ sm: 'center' }}
            paddingX={{ sm: 16, xs: 3 }}
            paddingY={{ xs: 4, sm: 3, md: 2 }}
            xs={12}
            md={6}
          >
            <Grid item marginBottom={{ md: 3, sm: 2, xs: 1 }}>
              <Typography fontWeight="bold" color="#18195E">
                Ingresa a tu cuenta
              </Typography>
            </Grid>
            <Grid>
              <Login />
            </Grid>
          </Grid>
        </Grid>
      </LoginWrapper>
    </>
  )
}

export default LoginPage
