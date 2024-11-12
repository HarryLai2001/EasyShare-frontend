import { Button, IconButton, OutlinedInput } from '@material-ui/core'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import KeepAlive, { useAliveController } from 'react-activation'
import { useParams } from 'react-router-dom'
import ChatMessageLeft from './ChatMessageLeft'
import { useDispatch, useSelector } from 'react-redux'
import ChatMessageRight from './ChatMessageRight'
import Api from '../../api'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import dateFormat from '../../utils/dateFormat'
import { flushSync } from 'react-dom'
import ChatRecord from './ChatRecord'
import { Divider } from '@mui/material'
import socket from '../../socketio'
import {
  unreadChatMessageCountReset,
  unreadChatMessageTotalCountInit,
  unreadCountDecr,
  updateChatList,
  updateChatUserInfo
} from '../../store/modules/chatMessageStore'

function PrivateChat() {
  const { userId } = useParams()
  const myUserId = useSelector((state) => state.myInfo.myUserId)

  const [myAvatar, setMyAvatar] = useState('')
  const [username, setUsername] = useState('用户名加载中...')
  const [avatar, setAvatar] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [lastMessageId, setLastMessageId] = useState(null)
  const [inputContent, setInputContent] = useState('')
  const [isSending, setIsSending] = useState(false)

  const ref = useRef(null)

  const dispatch = useDispatch()
  const { drop } = useAliveController()

  const fetchMyInfo = () => {
    Api.get('/user/user-info').then((res) => {
      if (res.data.code === 1000) {
        setMyAvatar(res.data.data.avatar)
      }
    })
  }

  const fetchUserInfo = () => {
    Api.get('/user/user-info', {
      params: {
        userId: parseInt(userId)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      if (res.data.code === 1000) {
        setUsername(res.data.data.username)
        setAvatar(res.data.data.avatar)
      }
    })
  }

  const fetchChatHistory = () => {
    Api.get('/chat/chat-history', {
      params: {
        userId: parseInt(userId),
        lastId: lastMessageId,
        pageSize: 10
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          if (res.data.data.length === 0) {
            setLastMessageId(null)
            return
          }
          setChatMessages((prev) => [...prev, ...res.data.data])
          setLastMessageId(res.data.data.at(-1).id)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const onMessage = (msg) => {
    if (msg.fromUserId === parseInt(userId)) {
      ref.current.scrollToBottom(true)
      setChatMessages((prev) => [msg, ...prev])
      dispatch(unreadCountDecr(parseInt(userId)))
    }
  }

  useEffect(() => {
    Api.put('/chat/read', {
      userId: parseInt(userId)
    })
  }, [chatMessages])

  useLayoutEffect(() => {
    fetchMyInfo()
    fetchUserInfo()
    fetchChatHistory()
    dispatch(unreadChatMessageCountReset(parseInt(userId)))
    dispatch(unreadChatMessageTotalCountInit())
    dispatch(updateChatUserInfo({ userId: userId, username: username, avatar: avatar }))
    socket.on(`chat`, onMessage)

    return () => {
      socket.off(`chat`, onMessage)
    }
  }, [])

  const loadMore = () => {
    if (lastMessageId !== null) {
      ref.current.scrollToBottom(false)
      fetchChatHistory()
    }
  }

  const handleSend = () => {
    flushSync(() => {
      setIsSending(true)
    })
    ref.current.scrollToBottom(true)
    Api.post('/chat/send', {
      content: inputContent,
      toUserId: parseInt(userId)
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setChatMessages([res.data.data, ...chatMessages])
          setInputContent('')
          dispatch(
            updateChatList({
              userId: parseInt(userId),
              content: res.data.data.content,
              sendAt: res.data.data.sendAt,
            })
          )
          dispatch(unreadCountDecr(parseInt(userId)))
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('发送失败')
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const handleOnExit = () => {
    drop(`private-chat-${userId}`)
    history.back()
  }

  return (
    <KeepAlive
      id={`private-chat-${userId}`}
      name={`private-chat-${userId}`}
      cacheKey={`private-chat-${userId}`}
      autoFreeze
    >
      <div className="w-full h-[100vh] flex flex-col bg-[#fdfdfd]">
        <div className="mx-8 my-4 flex justify-between items-center flex-none">
          <IconButton size="small" onClick={handleOnExit}>
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <span className="text-lg">{username}</span>
          <IconButton size="small">
            <MoreHorizRoundedIcon />
          </IconButton>
        </div>
        <Divider />
        <ChatRecord onScrollToTop={loadMore} ref={ref}>
          {chatMessages.map((message, index) => {
            return message.fromUserId === parseInt(userId) ? (
              <ChatMessageRight
                key={index}
                userId={parseInt(userId)}
                avatar={avatar}
                content={message.content}
                sendAt={dateFormat(message.sendAt)}
              />
            ) : (
              <ChatMessageLeft
                key={index}
                userId={myUserId}
                avatar={myAvatar}
                content={message.content}
                sendAt={dateFormat(message.sendAt)}
              />
            )
          })}
        </ChatRecord>
        <Divider />
        <div className="mx-12 mt-2 mb-8 justify-self-end flex items-end flex-none">
          <OutlinedInput
            multiline
            maxRows={2}
            fullWidth
            style={{ margin: `0 10px` }}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
          />
          <Button
            variant="outlined"
            color="primary"
            style={{ width: `80px`, padding: `2px 0`, marginBottom: `10px` }}
            size="small"
            disabled={inputContent === '' || isSending}
            onClick={handleSend}
          >
            {isSending ? '发送中...' : '发送'}
          </Button>
        </div>
      </div>
    </KeepAlive>
  )
}

export default PrivateChat
