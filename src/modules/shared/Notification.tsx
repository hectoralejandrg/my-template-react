import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/useRedux'
import { hideNotification } from '../auth/slice/authSlice'
import CloseIcon from '@mui/icons-material/Close'

const Notification = () => {
  const { notification } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const handleClose = () => dispatch(hideNotification(notification.type))

  return (
    <Dialog
      open={notification.open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="alert-dialog-notify">
        {handleClose && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container direction={'column'} alignItems={'center'} gap={3}>
          <Grid item>
            <Typography fontSize={30}>
              {notification?.type === 'success' ? '¡Exito!' : notification?.type === 'error' ? '¡Error!' : ''}
            </Typography>
          </Grid>
          <Grid item>
            <Typography textAlign={'center'}>{notification?.message}</Typography>
          </Grid>
          <Grid item>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                background:
                  notification?.type === 'success' ? 'linear-gradient(#7BCF79 , #7BCF79)' : 'linear-gradient(#F4BB43 , #F4BB43)',
                boxShadow: 'none'
              }}
            >
              Entendido
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default Notification
