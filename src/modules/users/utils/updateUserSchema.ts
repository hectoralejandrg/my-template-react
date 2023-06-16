import * as yup from 'yup'

export const updateUserSchema = yup.object({
  name: yup.string().required('Campo requerido'),
  role: yup.string().required('Campo requerido'),
  company: yup.string().when('role', {
    is: (role: string) => role !== '1',
    then: yup.string().required('Campo requerido')
  })
})
