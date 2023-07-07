import { Box, DialogContent, Grid } from '@mui/material'
import React from 'react'
import CustomInput from '../../shared/CustomInput'
import { ButtonSubmit } from '../../shared/ButtonSubmit'
import { useAppDispatch } from '../../../store/useRedux'
import { usePutCompanyMutation } from '../slice/companiesApiSlice'
import { useFormik } from 'formik'
import { createCompanySchema } from '../utils/schemaCreateCompany'
import { showNotification } from '../../auth/slice/authSlice'
import { Company } from '../interfaces/companies.interface'

interface Props {
  handleClose: () => void
  data: Company
}

const FormUpdateCompany = ({ handleClose, data }: Props) => {
  const dispatch = useAppDispatch()
  const [putCompany, { isLoading }] = usePutCompanyMutation()
  const { handleSubmit, touched, errors, getFieldProps } = useFormik({
    initialValues: {
      name: data?.name,
      carrierCode: data?.carrier_code
    },
    validationSchema: createCompanySchema,
    onSubmit: async ({ name, carrierCode }) => {
      await putCompany({
        id: data.id.toString(),
        name,
        carrier_code: carrierCode
      })
        .unwrap()
        .then(() => {
          dispatch(
            showNotification({
              message: 'Compañía actualizada con exito.',
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
              Actualizar
            </ButtonSubmit>
          </Grid>
        </Grid>
      </Box>
    </DialogContent>
  )
}

export default FormUpdateCompany
