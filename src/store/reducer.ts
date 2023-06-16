import { authApiSlice } from '../modules/auth/slice/authApiSlice'
import { usersApiSlice } from '../modules/users/slice/usersApiSlice'
import authReducer from '../modules/auth/slice/authSlice'
import usersReducer from '../modules/users/slice/usersSlice'

export const reducer = {
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [usersApiSlice.reducerPath]: usersApiSlice.reducer,
  auth: authReducer,
  users: usersReducer
}
