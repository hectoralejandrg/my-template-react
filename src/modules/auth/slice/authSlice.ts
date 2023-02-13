import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  user?: any
  token?: string
  pageName?: string | null
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
    }
  }
})

export const { setToken, setUser, setLogout, setPageName } = authSlice.actions
export default authSlice.reducer
