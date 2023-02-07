import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Email no valido').required('Campo requerido'),
  password: yup.string().required('Campo requerido')
})
