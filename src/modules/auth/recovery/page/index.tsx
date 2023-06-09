import { Box, Grid, Link, Typography } from '@mui/material'
import logo from '../../../../assets/logo_enviatrack.png'
import FormRecoveryPassword from '../componets/FormRecoveryPassword'

const RecoveryPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid sx={{ width: { xs: '90%', md: '30%' } }}>
        <Grid item marginBottom={{ md: 3, sm: 2, xs: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            height={{ xs: '35px', sm: '45px', lg: '55px' }}
          />
        </Grid>
        <Grid item marginBottom={{ md: 3, sm: 2, xs: 1 }}>
          <Typography fontSize={14} fontWeight="bold" color="#18195E">
            ¿Olvidaste tu Contraseña?
          </Typography>
          <Typography fontSize={10} color="#18195E" marginTop={1}>
            Ingresa tu e-mail y te enviaremos instrucciones para recuperarla.
          </Typography>
        </Grid>
        <Grid item marginBottom={{ md: 3, sm: 2, xs: 1 }}>
          <FormRecoveryPassword />
        </Grid>
        <Grid container justifyContent={'center'}>
          <Link href="/login" fontSize={12} color="#39549F">
            {'< Volver al login'}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecoveryPage
