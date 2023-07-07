import * as yup from 'yup'
import { Roles } from '../interfaces/roles.inteface'

export const updateUserSchema = yup.object({
  name: yup.string().required('Campo requerido'),
  role: yup.object().nullable().required('Campo requerido'),
  company: yup.object().nullable().when('role', {
    is: (role: Roles) => role.id !== 1,
    then: yup.object().nullable().required('Campo requerido')
  })
})
