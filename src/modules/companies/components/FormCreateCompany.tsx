import { usePostCompanyMutation } from '../slice/companiesApiSlice'
import { Box, DialogContent, Grid } from '@mui/material'
import CustomInput from '../../shared/CustomInput'
import { useFormik } from 'formik'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { createCompanySchema } from '../utils/schemaCreateCompany'
import { useAppDispatch } from '../../../store/useRedux'
import { showNotification } from '../../auth/slice/authSlice'

interface Props {
  handleClose: () => void
}

const FormCreateCompany = ({ handleClose }: Props) => {
  const dispatch = useAppDispatch()
  const [postCompany, { isLoading }] = usePostCompanyMutation()
  const { handleSubmit, touched, errors, getFieldProps } = useFormik({
    initialValues: {
      name: '',
      carrierCode: ''
    },
    validationSchema: createCompanySchema,
    onSubmit: async ({ name, carrierCode }) => {
      await postCompany({ name, carrier_code: carrierCode })
        .unwrap()
        .then(() => {
          dispatch(
            showNotification({
              message: 'Compañía creada con exito.',
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
            inputLabel="Nombre"
            {...getFieldProps('name')}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
          <CustomInput
            inputLabel="Código del carrier"
            {...getFieldProps('carrierCode')}
            error={touched.carrierCode && Boolean(errors.carrierCode)}
            helperText={touched.carrierCode && errors.carrierCode}
          />

          <Grid container justifyContent="flex-end">
            <ButtonSubmit isLoading={isLoading} icon="nope" sx={{ px: 10 }}>
              Guardar
            </ButtonSubmit>
          </Grid>
        </Grid>
      </Box>
    </DialogContent>
  )
}

export default FormCreateCompany
