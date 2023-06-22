import * as yup from 'yup'
import { Status } from '../interfaces/statusses.interface'

export const updateTrackingSchema = yup.object().shape({
  reference: yup.string().required('Campo requerido'),
  status: yup.object().nullable().required('Campo requerido'),
  name: yup.string().when('status', {
    is: (status: Status) => status.terminal,
    then: yup.string().required('Campo requerido')
  }),
  rut: yup.string().when('status', {
    is: (status: Status) => status.terminal,
    then: yup.string().required('Campo requerido')
  })
})
