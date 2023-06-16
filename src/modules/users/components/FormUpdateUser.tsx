import {
  Box,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  Switch
} from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import SelectRoles from './SelectRoles'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useFormik } from 'formik'
import SelectCompanies from './SelectCompanies'
import { useUpdateUserMutation } from '../slice/usersApiSlice'
import { useAppSelector } from '../../../store/useRedux'
import { useEffect } from 'react'
import { updateUserSchema } from '../utils/updateUserSchema'

interface Props {
  handleClose: () => void
}

interface PayloadUser {
  id?: number
  name?: string
  role: number
  active?: boolean
  company?: number
}

const FormUpdateUser = ({ handleClose }: Props) => {
  const { users } = useAppSelector((state) => state.users)
  const { profile } = useAppSelector((state) => state.auth)
  const [updateMutation, { isLoading }] = useUpdateUserMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        name: users?.name,
        role: users?.role?.id.toString(),
        active: users?.active,
        company: users?.company?.id
      },
      validationSchema: updateUserSchema,
      onSubmit: async ({ role, name, active, company }) => {
        const user: PayloadUser = {
          id: users?.id,
          name,
          active,
          role: Number(role)
        }
        if (profile?.role?.id !== 1) user.company = profile?.companyId
        if (profile?.role?.id === 1 && (role === '2' || role === '3')) user.company = Number(company)
        await updateMutation({ ...user })
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
          <SelectRoles
            value={values.role}
            onChange={(e) => setFieldValue('role', e.target.value)}
          />
          {validateCompany() && (
            <SelectCompanies
              value={values.company}
              onChange={(e) => setFieldValue('company', e.target.value)}
            />
          )}
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Estado
            </InputLabel>
            <Switch
              sx={{ marginTop: 2 }}
              color="success"
              checked={values?.active}
              onChange={(e) => setFieldValue('active', e.target.checked)}
            />
          </FormControl>
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

export default FormUpdateUser
