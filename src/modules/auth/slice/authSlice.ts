import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../interfaces/auth.interface'
import { NotificationState } from '../interfaces/notification.interface'

export interface AuthState {
  user?: any
  token?: string
  pageName?: string | null
  profile?: Profile
  notification: NotificationState
}

const initialState = {
  token: '',
  notification: { open: false, message: '', type: '' }
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
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string
        type: 'success' | 'error' | 'info' | ''
      }>
    ) => {
      state.notification.open = true
      state.notification.message = action.payload.message
      state.notification.type = action.payload.type
    },
    hideNotification: (
      state,
      action: PayloadAction<'success' | 'error' | 'info' | ''>
    ) => {
      state.notification = { open: false, message: '', type: action.payload }
    }
  }
})

export const {
  setToken,
  setUser,
  setLogout,
  setPageName,
  setProfile,
  showNotification,
  hideNotification
} = authSlice.actions
export default authSlice.reducer
