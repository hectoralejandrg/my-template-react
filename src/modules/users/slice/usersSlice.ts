import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Users } from '../interfaces/users.interface'

export interface UserState {
  users?: Users
}

const initialState = {} as UserState

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<Users>) => {
      state.users = action.payload
    }
  }
})

export const { setUsers } = userSlice.actions
export default userSlice.reducer
