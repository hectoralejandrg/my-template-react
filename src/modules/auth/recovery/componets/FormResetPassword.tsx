import { Box, Grid } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../../shared/ButtonSubmit'
import PasswordField from '../../../shared/PasswordField'
import {
  useDecodeTokenQuery,
  useLogoutMutation,
  useResetPasswordMutation
} from '../../slice/authApiSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordSchema } from '../utils/resetPasswordSchema'
import { useAppDispatch } from '../../../../store/useRedux'
import { showNotification } from '../../slice/authSlice'
import { useEffect } from 'react'

const FormResetPassword = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  const { data, isError, error } = useDecodeTokenQuery({
    token: searchParams.get('token')
  })
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: {
      newPassword: '',
      repeatPassword: ''
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async ({ newPassword }) => {
      await resetPassword({ uid: data?.id, newPassword })
        .unwrap()
        .then((res) => {
          dispatch(
            showNotification({
              // @ts-ignore
              message: res.message,
              type: 'success'
            })
          )
          logout()
          navigate('/login')
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
  })
  useEffect(() => {
    // @ts-ignore
    if (isError) dispatch(showNotification({ message: error.response.data.info, type: 'error' }))
  }, [isError])

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
