import { createSlice } from '@reduxjs/toolkit'

const socketStateStore = createSlice({
  name: 'socketState',
  initialState: {
    isConnected: false
  },
  reducers: {
    setConnectState(state, action) {
      state.isConnected = action.payload
    }
  }
})

export const { setConnectState, setChattingUser, resetChattingUser } = socketStateStore.actions

export default socketStateStore.reducer

