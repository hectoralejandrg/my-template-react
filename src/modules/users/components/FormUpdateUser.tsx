import {
  Box,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  Switch
} from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useFormik } from 'formik'
import { useUpdateUserMutation } from '../slice/usersApiSlice'
import { useAppDispatch, useAppSelector } from '../../../store/useRedux'
import { useEffect } from 'react'
import { updateUserSchema } from '../utils/updateUserSchema'
import { showNotification } from '../../auth/slice/authSlice'
import CompaniesAutocomplete from './AutocompleteCompanies'
import AutocompleteRoles from './AutocompleteRoles'

interface Props {
  handleClose: () => void
}

interface PayloadUser {
  id?: number
  name?: string
  role?: number
  active?: boolean
  company?: number
}

const FormUpdateUser = ({ handleClose }: Props) => {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const { profile } = useAppSelector((state) => state.auth)
  const [updateMutation, { isLoading }] = useUpdateUserMutation()
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } =
    useFormik({
      initialValues: {
        name: users?.name,
        role: users?.role,
        active: users?.active,
        company: users?.company
      },
      validationSchema: updateUserSchema,
      onSubmit: async ({ role, name, active, company }) => {
        const user: PayloadUser = {
          id: users?.id,
          name,
          active,
          role: role?.id
        }
        if (profile?.role?.id !== 1) user.company = profile?.companyId
        if (profile?.role?.id === 1 && (role?.id === 2 || role?.id === 3)) user.company = company?.id
        await updateMutation({ ...user })
          .unwrap()
          .then(() => {
            dispatch(
              showNotification({
                message: 'Usuario se actualizó correctamente',
                type: 'success'
              })
            )
            handleClose()
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
          <AutocompleteRoles
            inputLabel="Roles"
            value={values?.role}
            handleChange={(value) => setFieldValue('role', value)}
            error={touched.role && Boolean(errors.role)}
            helperText={touched.role && errors.role}
          />
          {validateCompany() && (
            <CompaniesAutocomplete
              inputLabel="Compañía"
              value={values?.company}
              handleChange={(value) => setFieldValue('company', value)}
              error={touched.company && Boolean(errors.company)}
              helperText={touched.company && errors.company}
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
