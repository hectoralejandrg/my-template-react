import { Box, Grid } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../../shared/ButtonSubmit'
import PasswordField from '../../../shared/PasswordField'
import {
  useDecodeTokenQuery,
  useResetPasswordMutation
} from '../../slice/authApiSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FormResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data } = useDecodeTokenQuery({ token: searchParams.get('token') })
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: {
      newPassword: '',
      repeatPassword: ''
    },
    // validationSchema: resetPasswordSchema,
    onSubmit: async ({ newPassword }) => {
      console.log(newPassword)
      await resetPassword({ uid: data?.id, newPassword })
        .unwrap()
        .then(() => navigate('/login'))
    }
  })
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ width: '100%', marginTop: 5 }}
    >
      <Grid container gap={3}>
        <PasswordField
          inputLabel="Nueva contraseña"
          id="newPassword"
          name="newPassword"
          type="password"
          size="small"
          value={values.newPassword}
          onChange={handleChange}
          error={touched.newPassword && Boolean(errors.newPassword)}
          helperText={touched.newPassword && errors.newPassword}
        />
        <PasswordField
          inputLabel="Repite la contraseña"
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          size="small"
          value={values.repeatPassword}
          onChange={handleChange}
          error={touched.repeatPassword && Boolean(errors.repeatPassword)}
          helperText={touched.repeatPassword && errors.repeatPassword}
        />
        <Grid container>
          <ButtonSubmit
            isLoading={isLoading}
            icon="nope"
            sx={{ px: 10, width: '100%' }}
          >
            Nueva contraseña
          </ButtonSubmit>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormResetPassword
