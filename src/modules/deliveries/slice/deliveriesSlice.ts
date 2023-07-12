import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  terminal?: string
}

const initialState = {} as AuthState

const deliveriesSlice = createSlice({
  name: 'deliveriesSlice',
  initialState,
  reducers: {
    setTerminal: (state, action: PayloadAction<string | undefined>) => {
      state.terminal = action.payload
    }
  }
})

export const { setTerminal } = deliveriesSlice.actions
export default deliveriesSlice.reducer
