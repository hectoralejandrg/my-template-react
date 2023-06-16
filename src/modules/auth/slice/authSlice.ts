import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../interfaces/auth.interface'

export interface AuthState {
  user?: any
  token?: string
  pageName?: string | null
  profile?: Profile
}

const initialState = { token: '' } as AuthState

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
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
    }
  }
})

export const { setToken, setUser, setLogout, setPageName, setProfile } =
  authSlice.actions
export default authSlice.reducer
