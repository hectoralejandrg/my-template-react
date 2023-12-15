import { Box, Grid, styled, Typography } from '@mui/material'
import Login from '../componets/Login'
import logo from '../../../../assets/logo_enviatrack.png'
import AnimationInfo from '../componets/AnimationInfo'
import SliderWithIcons from '../componets/SliderWithIcons'

const LoginWrapper = styled('div')(
  () => `
    position: relative;
    z-index: 3;
  `
)

const FooterWraper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '95%',
  zIndex: 3,
  [theme.breakpoints.down('sm')]: {
    left: '5%'
  },
  [theme.breakpoints.up('sm')]: {
    left: '60%'
  },
  [theme.breakpoints.up('md')]: {
    left: '70%'
  },
  [theme.breakpoints.up('lg')]: {
    left: '80%'
  }
}))

const ContainerWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  background: 'linear-gradient(90deg, #395494 0%, #31AEE4 100%)',
  [theme.breakpoints.down('md')]: {
    minHeight: '100vh'
  }
}))

const CircleWraper = styled('div')(({ theme }) => ({
  backgroundColor: '#FFFF',
  borderRadius: '50%',
  position: 'absolute',
  overflow: 'hidden',
  zIndex: 2,
  [theme.breakpoints.up('md')]: {
    width: '100%',
    height: '200%',
    transform: 'translate(-50%, -25%)'
  },
  [theme.breakpoints.down('md')]: {
    width: '200%',
    height: '100%',
    transform: 'translate(-25%, -50%)'
  }
}))

const LoginPage = () => {
  return (
    <>
      <ContainerWrapper>
        <CircleWraper />
        <LoginWrapper>
          <Grid container minHeight={{ md: '100vh' }} zIndex="auto">
            <Grid
              container
              item
              direction={{ md: 'column', sm: 'row' }}
              justifyContent={{ sm: 'flex-start', md: 'center' }}
              paddingX={{ sm: 16, xs: 3 }}
              paddingY={{ xs: 4, sm: 3, md: 2 }}
              xs={12}
              md={6}
            >
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
                  Ingresa a tu cuenta
                </Typography>
                <Typography fontSize={10} color="#18195E">
                  Podras actualizar el estado de tus envíos de manera rápida y
                  segura.
                </Typography>
              </Grid>
              <Grid>
                <Login />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <AnimationInfo />
              <SliderWithIcons
                images={[
                  { src: 'ordenPreparacion.png', alt: 'Orden de preparacion' },
                  { src: 'retiradoOperador.png', alt: 'Retirado por operador' },
                  { src: 'reparto.png', alt: 'En reparto' },
                  { src: 'entregado.png', alt: 'Entregado' }
                ]}
              />
            </Grid>
          </Grid>
        </LoginWrapper>
        <FooterWraper>
          <Typography fontSize={11} color={'white'}>
            2023 Envíame. Todos los derechos reservados ©
          </Typography>
        </FooterWraper>
      </ContainerWrapper>
    </>
  )
}

export default LoginPage
