import { Box, Grid, Typography } from '@mui/material'
import { keyframes, styled } from '@mui/system'
import img1 from '../../../../assets/ordenPreparacion.png'
import img2 from '../../../../assets/retiradoOperador.png'
import img3 from '../../../../assets/reparto.png'
import img4 from '../../../../assets/entregado.png'
import arrow from '../../../../assets/arrow.png'

const ContainerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}))

const LabelWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: 20,
  paddingTop: 20
}))

const ArrowWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingLeft: 5
}))

const animation = keyframes`
from {
    opacity: 0;
}
25% {
  opacity: 0.5;
}
50% {
  opacity: 1;
}
75% {
  opacity: 0.5;
}
to {
    opacity: 0;
}
`

const AnimationInfo = () => {
  return (
    <ContainerWrapper>
      <Grid>
        <LabelWrapper>
          <Box
            component={'img'}
            src={img1}
            paddingRight={3}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
          <Typography
            component={'span'}
            color={'white'}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          >
            Orden de preparación
          </Typography>
        </LabelWrapper>
        <ArrowWrapper>
          <Box
            component={'img'}
            src={arrow}
            paddingLeft={1}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
        </ArrowWrapper>
        <LabelWrapper>
          <Box
            component={'img'}
            src={img2}
            paddingRight={3}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
          <Typography
            component={'span'}
            color={'white'}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          >
            Retirado por operador
          </Typography>
        </LabelWrapper>
        <ArrowWrapper>
          <Box
            component={'img'}
            src={arrow}
            paddingLeft={1}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
        </ArrowWrapper>
        <LabelWrapper>
          <Box
            component={'img'}
            src={img3}
            paddingRight={3}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
          <Typography
            component={'span'}
            color={'white'}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          >
            En reparto
          </Typography>
        </LabelWrapper>
        <ArrowWrapper>
          <Box
            component={'img'}
            src={arrow}
            paddingLeft={1}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
        </ArrowWrapper>
        <LabelWrapper>
          <Box
            component={'img'}
            src={img4}
            paddingRight={3}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          />
          <Typography
            component={'span'}
            color={'white'}
            sx={{ animation: `${animation} 7s infinite cubic-bezier(0.0, 0.0, 1.0, 1.0)` }}
          >
            Entregado
          </Typography>
        </LabelWrapper>
      </Grid>
    </ContainerWrapper>
  )
}

export default AnimationInfo
