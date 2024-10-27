import { createSlice } from '@reduxjs/toolkit'

const systemMessageCountStore = createSlice({
  name: 'unreadMessageCnt',
  initialState: {
    unreadLikeMessageCount: 0,
    unreadFollowMessageCount: 0,
    unreadCommentMessageCount: 0
  },
  reducers: {
    countsInit(state, action) {
      switch (action.payload.type) {
        case 'like':
          state.unreadLikeMessageCount = action.payload.unreadCounts
          break
        case 'follow':
          state.unreadFollowMessageCount = action.payload.unreadCounts
          break
        case 'comment':
          state.unreadCommentMessageCount = action.payload.unreadCounts
          break
      }
    },
    countsIncr(state, action) {
      switch (action.payload) {
        case 'like':
          state.unreadLikeMessageCount++
          break
        case 'follow':
          state.unreadFollowMessageCount++
          break
        case 'comment':
          state.unreadCommentMessageCount++
          break
      }
    },
    countsReset(state, action) {
      switch (action.payload) {
        case 'like':
          state.unreadLikeMessageCount= 0
          break
        case 'follow':
          state.unreadFollowMessageCount = 0
          break
        case 'comment':
          state.unreadCommentMessageCount = 0
          break
      }
    }
  }
})

export const { countsInit, countsIncr, countsReset } = systemMessageCountStore.actions

export default systemMessageCountStore.reducer
