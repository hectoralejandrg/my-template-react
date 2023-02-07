import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  user?: any
  token?: string
}

const initialState = {
  token: ''
} as AuthState

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setToken (state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    setUser (state, action: PayloadAction<any>) {
      state.user = action.payload
    },
    setLogout: () => initialState
  }
})

export const { setToken, setUser, setLogout } = authSlice.actions
export default authSlice.reducer
