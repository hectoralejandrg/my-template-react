import * as yup from 'yup'

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required('Ingrese una contraseña válida')
    .min(8, 'Contraseña debe tener mínimo 8 caracteres')
    .matches(/[0-9]/, 'Contraseña requiere un número')
    .matches(/[a-z]/, 'Contraseña requiere al menos un caracter en minúscula')
    .matches(/[A-Z]/, 'Contraseña requiere al menos un caracter en mayúscula')
    .matches(/[^\w]/, 'Contraseña requiere al menos un símbolo'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Debe coincidir con el valor del campo Nueva contraseña')
})
