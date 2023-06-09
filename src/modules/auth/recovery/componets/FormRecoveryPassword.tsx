import { Box, Grid } from '@mui/material'
import CustomInput from '../../../shared/CustomInput'
import { ButtonSubmit } from '../../../shared/ButtonSubmit'
// import ReCAPTCHA from 'react-google-recaptcha'
import { useFormik } from 'formik'
import { useResetPasswordEmailMutation } from '../../slice/authApiSlice'
import { recoverySchema } from '../utils/recoverySchema'

const FormRecoveryPassword = () => {
  const [sendEmail, { isLoading }] = useResetPasswordEmailMutation()
  const { handleSubmit, handleChange, values, touched, errors } =
    useFormik({
      initialValues: {
        email: '',
        token: ''
      },
      validationSchema: recoverySchema,
      onSubmit: async ({ email, token }) => {
        console.log(email, token)
        await sendEmail({ email })
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
        <CustomInput
          id="email"
          name="email"
          type="email"
          size="small"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        {/* <Grid container item justifyContent={'center'}>
          <ReCAPTCHA
            sitekey="6Lf2vLUcAAAAAB2-9n2pw6xUILb9OkVQFrCD2EZX"
            onChange={(token) => setFieldValue('token', token)}
          />
        </Grid> */}
        <Grid container>
          <ButtonSubmit
            isLoading={isLoading}
            icon="nope"
            sx={{ px: 10, width: '100%' }}
          >
            Enviar mail de recuperación
          </ButtonSubmit>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormRecoveryPassword
