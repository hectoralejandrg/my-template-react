import { authApiSlice } from '../modules/auth/slice/authApiSlice'
import authReducer from '../modules/auth/slice/authSlice'

export const reducer = {
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  auth: authReducer
}
