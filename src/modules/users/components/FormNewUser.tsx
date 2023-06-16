import { Box, DialogContent, Grid } from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import SelectRoles from './SelectRoles'
import { useFormik } from 'formik'
import SelectCompanies from './SelectCompanies'
import { useCreateUserMutation } from '../slice/usersApiSlice'
import { useEffect } from 'react'
import { newUserSchema } from '../utils/newUserSchema'
import { useAppSelector } from '../../../store/useRedux'

interface Props {
  handleClose: () => void
}

interface PayloadUser {
  name: string
  role: number
  email: string
  active: boolean
  company?: number
}

const FormNewUser = ({ handleClose }: Props) => {
  const [createUser, { isLoading }] = useCreateUserMutation()
  const { profile } = useAppSelector((state) => state.auth)
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        name: '',
        role: '',
        email: '',
        company: ''
      },
      validationSchema: newUserSchema,
      onSubmit: async ({ role, company, email, name }) => {
        const user: PayloadUser = {
          name,
          email,
          active: true,
          role: Number(role)
        }
        if (profile?.role?.id !== 1) user.company = profile?.companyId
        if (profile?.role?.id === 1 && (role === '2' || role === '3')) user.company = Number(company)
        await createUser({ ...user })
          .unwrap()
          .then(() => handleClose())
      }
    })

  useEffect(() => {
    if (values?.role === '1') setFieldValue('company', '')
  }, [values])

  const validateCompany = (): boolean => {
    if (profile?.role?.id !== 1) return false
    return values?.role === '2' || values?.role === '3'
  }

  return (
    <DialogContent>
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
            error={touched.role && Boolean(errors.role)}
            // helperText={touched.role && errors.role}
          />
          {validateCompany() && (
            <SelectCompanies
              value={values.company}
              onChange={(e) => setFieldValue('company', e.target.value)}
              error={touched?.company && Boolean(errors?.company)}
              helperText={touched?.company && errors?.company}
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
    </DialogContent>
  )
}

export default FormNewUser
