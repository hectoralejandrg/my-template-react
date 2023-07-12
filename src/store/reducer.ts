import { trackingApiSlice } from '../modules/tracking/slice/trackingApiSlice'
import { authApiSlice } from '../modules/auth/slice/authApiSlice'
import { usersApiSlice } from '../modules/users/slice/usersApiSlice'
import { deliveriesApiSlice } from '../modules/deliveries/slice/deliveriesApiSlice'
import { companiesApiSlice } from '../modules/companies/slice/companiesApiSlice'
import authReducer from '../modules/auth/slice/authSlice'
import usersReducer from '../modules/users/slice/usersSlice'
import deliveriesReducer from '../modules/deliveries/slice/deliveriesSlice'

export const reducer = {
  [trackingApiSlice.reducerPath]: trackingApiSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [usersApiSlice.reducerPath]: usersApiSlice.reducer,
  [deliveriesApiSlice.reducerPath]: deliveriesApiSlice.reducer,
  [companiesApiSlice.reducerPath]: companiesApiSlice.reducer,
  auth: authReducer,
  users: usersReducer,
  deliveries: deliveriesReducer
}
