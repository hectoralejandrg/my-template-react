import { DialogActions, DialogContent, Typography } from '@mui/material'
import { Users } from '../interfaces/users.interface'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useResetPasswordEmailMutation } from '../../auth/slice/authApiSlice'

interface Props {
  user?: Users
  handleClose: () => void
}

const ComponentRecovery = ({ user, handleClose }: Props) => {
  const [sendEmail, { isLoading }] = useResetPasswordEmailMutation()
  const handleSendEmail = async () => {
    await sendEmail({ email: user?.email }).unwrap().then(() => handleClose())
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
