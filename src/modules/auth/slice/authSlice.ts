import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  user?: any
  token?: string
  pageName?: string | null
  roleId?: number
}

const initialState = {
  token: ''
} as AuthState

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLogout: () => initialState,
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    },
    setPageName: (state, action: PayloadAction<string | null>) => {
      state.pageName = action.payload
    },
    setRoleId: (state, action: PayloadAction<number>) => {
      state.roleId = action.payload
    }
  }
})

export const { setToken, setUser, setLogout, setPageName, setRoleId } =
  authSlice.actions
export default authSlice.reducer
