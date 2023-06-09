import { Box, Grid, Typography } from '@mui/material'
import logo from '../../../../assets/logo_enviatrack.png'
import FormResetPassword from '../componets/FormResetPassword'

const resetPassword = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3
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
            Contraseña nueva
          </Typography>
          <Typography fontSize={10} color="#18195E" marginTop={1}>
            Escribe tu nueva contraseña y confirmala.
          </Typography>
        </Grid>
        <Grid item marginBottom={{ md: 3, sm: 2, xs: 1 }}>
          <FormResetPassword />
        </Grid>
      </Grid>
    </Box>
  )
}

export default resetPassword
