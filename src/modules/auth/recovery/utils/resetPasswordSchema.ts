import * as yup from 'yup'

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Must match "password" field value')
})
