import { createSlice } from '@reduxjs/toolkit'

const socketStateStore = createSlice({
  name: 'socketState',
  initialState: {
    isConnected: false,
    chattingUserId: -1
  },
  reducers: {
    setConnectState(state, action) {
      state.isConnected = action.payload
    },
    setChattingUser(state, action) {
      state.chattingUserId = action.payload
    },
    resetChattingUser(state) {
      state.chattingUserId = -1
    }
  }
})

export const { setConnectState, setChattingUser, resetChattingUser } = socketStateStore.actions

export default socketStateStore.reducer

