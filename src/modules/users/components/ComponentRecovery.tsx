import { DialogActions, DialogContent, Typography } from '@mui/material'
import { Users } from '../interfaces/users.interface'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useResetPasswordEmailMutation } from '../../auth/slice/authApiSlice'
import { useAppDispatch } from '../../../store/useRedux'
import { showNotification } from '../../auth/slice/authSlice'

interface Props {
  user?: Users
  handleClose: () => void
}

const ComponentRecovery = ({ user, handleClose }: Props) => {
  const dispatch = useAppDispatch()
  const [sendEmail, { isLoading }] = useResetPasswordEmailMutation()
  const handleSendEmail = async () => {
    await sendEmail({ email: user?.email })
      .unwrap()
      .then((res) => {
        dispatch(
          showNotification({
            // @ts-ignore
            message: res.message,
            type: 'success'
          })
        )
        handleClose()
      })
      .catch((err) => {
        dispatch(
          showNotification({
            message: err.response.data.info,
            type: 'error'
          })
        )
      })
  }
  return (
    <>
      <DialogContent>
        <Typography component="p">
          Esta acción reenviará un correo de recuperación de contraseña a la
          siguiente direccion de correo <strong>{user?.email}</strong>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <ButtonSubmit
          isLoading={isLoading}
          icon={'nope'}
          onClick={handleSendEmail}
        >
          Enviar email
        </ButtonSubmit>
      </DialogActions>
    </>
  )
}

export default ComponentRecovery
