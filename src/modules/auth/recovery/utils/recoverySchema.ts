import * as yup from 'yup'

export const recoverySchema = yup.object({
  email: yup.string().email('Email no valido').required('Campo requerido')
})
