import { useRef, useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  Popover,
  Typography,
  styled
} from '@mui/material'

import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import { useLogoutMutation } from '../../../modules/auth/slice/authApiSlice'
import { useAppSelector } from '../../../store/useRedux'

const UserBoxButton = styled(Button)(({ theme }) => ({
  paddingLeft: 5,
  paddingRight: 5
}))

const MenuUserBox = styled(Box)(() => ({
  //   background: ${theme.palette.success},
  padding: 12
}))

const UserBoxText = styled(Box)(() => ({
  textAlign: 'left',
  paddingLeft: 8
}))

const UserBoxLabel = styled(Typography)(() => ({
  fontWeight: 'bold',
  color: '#718096',
  display: 'block'
}))

const HeaderUserbox = () => {
  const { profile } = useAppSelector((state) => state.auth)
  const userProd = {
    name: profile?.email,
    avatar: 'src/assets/pic.png',
    jobtitle: profile?.role?.name
  }

  const [logout] = useLogoutMutation()

  const ref = useRef<any>(null)

  const [isOpen, setOpen] = useState<boolean>(false)

  const handleOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleLogOut = async () => {
    await logout()
  }

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="circular" alt={userProd.name} src={userProd.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="subtitle2">{userProd?.name}</UserBoxLabel>
            <UserBoxLabel variant="subtitle2">{userProd?.jobtitle}</UserBoxLabel>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1, color: '#718096' }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="circular"
            alt={userProd?.name}
            src={userProd?.avatar}
            sx={{ overflow: 'hidden' }}
          />
          <UserBoxText>
            <UserBoxLabel variant="subtitle2">{userProd?.name}</UserBoxLabel>
            <UserBoxLabel variant="subtitle2">{userProd?.jobtitle}</UserBoxLabel>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleLogOut}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Cerrar sesión
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default HeaderUserbox
