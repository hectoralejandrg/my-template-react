import { Box, Grid } from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import SelectRoles from './SelectRoles'
import { useFormik } from 'formik'
import SelectCompanies from './SelectCompanies'

const FormNewUser = () => {
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        name: '',
        roles: '',
        email: '',
        company: ''
      },
      //   validationSchema: loginSchema,
      onSubmit: ({ roles, company }) => {
        console.log(roles, company)
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
          id="rut"
          name="rut"
          type="text"
          size="small"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        <SelectCompanies
          value={values.company}
          onChange={(e) => setFieldValue('company', e.target.value)}
        />
        <SelectRoles
          value={values.roles}
          onChange={(e) => setFieldValue('roles', e.target.value)}
        />
        <Grid container justifyContent="flex-end">
          <ButtonSubmit
            isLoading={false}
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
