import { createSlice } from '@reduxjs/toolkit'
import Api from '../../api'

const chatMessageStore = createSlice({
  name: 'chatMessageStore',
  initialState: {
    unreadChatMessageTotalCount: 0,
    chatList: []
  },
  reducers: {
    chatListInit(state, action) {
      state.chatList = action.payload.map((chat) => {
        return {
          userId: chat.userId,
          username: chat.username,
          avatar: chat.avatar,
          content: chat.content,
          sendAt: chat.sendAt,
          unreadCount: chat.unreadCount
        }
      })
    },
    unreadChatMessageTotalCountInit(state) {
      state.unreadChatMessageTotalCount = state.unreadChatMessageTotalCount = state.chatList.reduce(
        (prev, curr) => {
          return prev + curr.unreadCount
        },
        0
      )
    },
    unreadChatMessageTotalCountIncr(state) {
      state.unreadChatMessageTotalCount++
    },
    unreadChatMessageCountReset(state, action) {
      state.chatList = state.chatList.map((chat) =>
        chat.userId === action.payload ? { ...chat, unreadCount: 0 } : chat
      )
    },
    chatListUpdate(state, action) {
      state.chatList = [
        action.payload,
        ...state.chatList.filter((chat) => chat.userId !== action.payload.userId)
      ]
    },
    updateChatUserInfo(state, action) {
      state.chatList = state.chatList.map((chat) =>
        chat.userId === action.payload.userId
          ? { ...chat, username: action.payload.username, avatar: action.payload.avatar }
          : chat
      )
    },
    unreadCountDecr(state, action) {
      state.chatList = state.chatList.map((chat) =>
        chat.userId === action.payload ? { ...chat, unreadCount: chat.unreadCount - 1 } : chat
      )
      state.unreadChatMessageTotalCount--
    }
  }
})

export const {
  chatListInit,
  unreadChatMessageTotalCountInit,
  unreadChatMessageCountReset,
  updateChatUserInfo,
  unreadCountDecr
} = chatMessageStore.actions

const { chatListUpdate, unreadChatMessageTotalCountIncr } = chatMessageStore.actions
const updateChatList = ({ userId, content, sendAt }) => {
  return async (dispatch, getState) => {
    const state = getState()
    const oldChat = state.chatMessage.chatList.find((chat) => chat.userId === userId)
    let newChat
    if (oldChat) {
      newChat = {
        ...oldChat,
        content: content,
        sendAt: sendAt,
        unreadCount: oldChat.unreadCount + 1
      }
    } else {
      let res = await Api.get('/user/user-info', {
        params: {
          userId: userId
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
      newChat = {
        userId: userId,
        username: res.data.data.username,
        avatar: res.data.data.avatar,
        content: content,
        sendAt: sendAt,
        unreadCount: 1
      }
    }
    dispatch(chatListUpdate(newChat))

    dispatch(unreadChatMessageTotalCountIncr())
  }
}

export { updateChatList }

export default chatMessageStore.reducer
