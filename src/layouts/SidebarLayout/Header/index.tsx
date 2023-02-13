import { Box, styled, Typography, useTheme } from '@mui/material'
import { useAppSelector } from '../../../store/useRedux'
import HeaderUserbox from './HeaderUserbox'

const HeaderWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '5px'
}))

const LabelWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const Header = () => {
  const { pageName } = useAppSelector((state) => state.auth)
  const theme = useTheme()
  return (
    <HeaderWrapper>
      <LabelWrapper>
        <Typography
          component={'span'}
          sx={{
            fontSize: '18px',
            color: `${theme.palette.primary.main}`,
            fontWeight: 'bold'
          }}
        >
          {pageName}
        </Typography>
      </LabelWrapper>
      <HeaderUserbox />
    </HeaderWrapper>
  )
}

export default Header
