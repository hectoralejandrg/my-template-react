import { Box, DialogContent, Grid } from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useFormik } from 'formik'
import { useCreateUserMutation } from '../slice/usersApiSlice'
import { useEffect } from 'react'
import { newUserSchema } from '../utils/newUserSchema'
import { useAppSelector } from '../../../store/useRedux'
import { Company } from '../../companies/interfaces/companies.interface'
import AutocompleteCompanies from './AutocompleteCompanies'
import AutocompleteRoles from './AutocompleteRoles'
import { Roles } from '../interfaces/roles.inteface'

interface Props {
  handleClose: () => void
}

interface PayloadUser {
  name: string
  role?: number
  email: string
  active: boolean
  company?: number
}

interface ValuesFormik {
  name: string
  role?: Roles | null
  email: string
  company: Company | null
}

const FormNewUser = ({ handleClose }: Props) => {
  const [createUser, { isLoading }] = useCreateUserMutation()
  const { profile } = useAppSelector((state) => state.auth)
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik<ValuesFormik>({
      initialValues: {
        name: '',
        email: '',
        role: null,
        company: null
      },
      validationSchema: newUserSchema,
      onSubmit: async ({ role, company, email, name }) => {
        const user: PayloadUser = {
          name,
          email,
          active: true,
          role: role?.id
        }
        if (profile?.role?.id !== 1) user.company = profile?.companyId
        if (profile?.role?.id === 1 && (role?.id === 2 || role?.id === 3)) user.company = company?.id
        await createUser({ ...user })
          .unwrap()
          .then(() => handleClose())
      }
    })

  useEffect(() => {
    if (values?.role?.id === 1) setFieldValue('company', null)
  }, [values])

  const validateCompany = (): boolean => {
    if (profile?.role?.id !== 1) return false
    return values?.role?.id === 2 || values?.role?.id === 3
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
          <AutocompleteRoles
              inputLabel="Roles"
              value={values?.role}
              handleChange={(value) => setFieldValue('role', value)}
              error={touched.role && Boolean(errors.role)}
              helperText={touched.role && errors.role}
            />
          {validateCompany() && (
            <AutocompleteCompanies
              inputLabel="Compañía"
              value={values.company}
              handleChange={(value) => setFieldValue('company', value)}
              error={touched.company && Boolean(errors.company)}
              helperText={touched.company && errors.company}
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
