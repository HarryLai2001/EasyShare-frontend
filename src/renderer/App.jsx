import { HashRouter as Router } from 'react-router-dom'
import BaseRouter from './router'
import { AliveScope } from 'react-activation'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import socket from './socketio'
import { setConnectState } from './store/modules/socketStateStore'
import { useDispatch, useSelector } from 'react-redux'
import Api from './api'
import {
  chatListInit,
  unreadChatMessageTotalCountInit,
  updateChatList
} from './store/modules/chatMessageStore'
import { countsIncr, countsInit } from './store/modules/systemMessageCountStore'

function App() {
  const isConnected = useSelector((state) => state.socketState.isConnected)

  const dispatch = useDispatch()

  useEffect(() => {
    // 刷新后重新连接socket
    if (isConnected && !socket.connected) {
      socket.io.opts.query = {
        token: sessionStorage.getItem('token')
      }
      socket.connect()
    }

    const handleOnRecieveAction = (actionCode) => {
      if (actionCode === 2001) {
        dispatch(countsIncr('like'))
      }
      if (actionCode === 2002) {
        dispatch(countsIncr('follow'))
      }
      if (actionCode === 2003) {
        dispatch(countsIncr('comment'))
      }
    }

    const handleOnReceiveMessage = (msg) => {
      dispatch(
        updateChatList({
          userId: msg.fromUserId,
          content: msg.content,
          sendAt: msg.sendAt
        })
      )
    }

    socket.on('connect', () => {
      console.log('socket开始连接')
      console.log('socket连接状态:' + socket.connected)
      Api.get('/system-message/like-unread-count').then((res) => {
        if (res.data.code === 1000) {
          dispatch(countsInit({ type: 'like', unreadCounts: res.data.data }))
        }
      })
      Api.get('/system-message/follow-unread-count').then((res) => {
        if (res.data.code === 1000) {
          dispatch(countsInit({ type: 'follow', unreadCounts: res.data.data }))
        }
      })
      Api.get('/system-message/comment-unread-count').then((res) => {
        if (res.data.code === 1000) {
          dispatch(countsInit({ type: 'comment', unreadCounts: res.data.data }))
        }
      })
      Api.get('/chat/chat-list')
        .then((res) => {
          if (res.data.code === 1000) {
            dispatch(chatListInit(res.data.data))
          }
        })
        .then(() => {
          dispatch(unreadChatMessageTotalCountInit())
        })
    })

    socket.on('disconnect', () => {
      console.log('socket连接断开')
      console.log('socket连接状态:' + socket.connected)
    })

    socket.on('action', handleOnRecieveAction)
    socket.on('chat', handleOnReceiveMessage)

    return () => {
      socket.disconnect()
      dispatch(setConnectState(false))
    }
  }, [])

  return (
    <>
      <Router>
        <AliveScope>
          <BaseRouter />
        </AliveScope>
      </Router>
      <Toaster />
    </>
  )
}

export default App
