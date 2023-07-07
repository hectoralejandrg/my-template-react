import * as yup from 'yup'

export const createCompanySchema = yup.object().shape({
  name: yup.string().required('Campo requerido'),
  carrierCode: yup.string().required('Campo requerido')
})
