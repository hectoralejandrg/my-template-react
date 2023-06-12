import { Box, Grid } from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import SelectRoles from './SelectRoles'
import { useFormik } from 'formik'
import SelectCompanies from './SelectCompanies'
import { useCreateUserMutation } from '../slice/usersApiSlice'

const FormNewUser = () => {
  const [createUser, { isLoading }] = useCreateUserMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        name: '',
        role: '',
        email: '',
        company: ''
      },
      //   validationSchema: loginSchema,
      onSubmit: async ({ role, company, email, name }) => {
        console.log(role, company)
        await createUser({ email, name, active: true, role: Number(role), company })
      }
    })
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
    >
      <Grid container gap={3}>
        <CustomInput
          inputLabel="Nombres y Apellidos"
          id="name"
          name="name"
          type="text"
          size="small"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <CustomInput
          inputLabel="Email"
          id="email"
          name="email"
          type="text"
          size="small"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        <SelectRoles
          value={values.role}
          onChange={(e) => setFieldValue('role', e.target.value)}
        />
        {values.role === '2' && (
          <SelectCompanies
            value={values.company}
            onChange={(e) => setFieldValue('company', e.target.value)}
          />
        )}
        <Grid container justifyContent="flex-end">
          <ButtonSubmit
            isLoading={isLoading}
            icon="nope"
            sx={{ px: 10, width: '100%' }}
          >
            Guardar
          </ButtonSubmit>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormNewUser
