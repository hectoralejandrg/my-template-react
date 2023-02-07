import { Box, Grid, IconButton, InputAdornment, Link, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../../shared/ButtonSubmit'
import PasswordField from '../../../shared/PasswordField'
import { useLoginMutation } from '../../slice/authApiSlice'
import { loginSchema } from '../utils/loginSchema'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const Login = () => {
  const [login, { isLoading }] = useLoginMutation()
  const { handleSubmit, handleChange, values, touched, errors, setFieldValue } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password })
    }
  })
  return (
    <Grid container>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container gap={3}>
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            size="small"
            fullWidth
            required
            autoFocus
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            InputProps={{
              endAdornment: (
                <>
                  {values?.email && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setFieldValue('email', '') }
                        edge="end"
                      >
                        {<HighlightOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              )
            }}
          />
          <Grid container item justifyContent="flex-end" width={'100%'}>
            <PasswordField
              id="password"
              name="password"
              placeholder="Password"
              size="small"
              fullWidth
              required
              autoComplete="off"
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            <Link href="#" fontSize={11}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Grid>
          <ButtonSubmit isLoading={isLoading} icon="nope" fullWidth>
            Iniciar sesión
          </ButtonSubmit>
        </Grid>
      </Box>
    </Grid>
  )
}

export default Login
