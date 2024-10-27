import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { useEffect, useRef, useState } from 'react'
import { useAliveController } from 'react-activation'
import Api from '../../api'
import toast from 'react-hot-toast'
import { Divider, IconButton } from '@mui/material'
import InfiniteScroll from '../../components/InfiniteScroll'
import CommentMessage from './CommentMessage'
import dateFormat from '../../utils/dateFormat'

function CommentMessageList() {
  const [commentMessageList, setCommentMessageList] = useState([])
  const [lastMessageId, setLastMessageId] = useState(null)

  const ref = useRef(null)

  const { drop } = useAliveController()

  const fetchCommentMessage = () => {
    Api.get('/system-message/comment-list', {
      params: {
        lastId: lastMessageId,
        pageSize: 50
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          if (res.data.data.length === 0) {
            setLastMessageId(null)
            return
          }
          setCommentMessageList((prev) => [...prev, ...res.data.data])
          setLastMessageId(res.data.data.at(-1).id)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  useEffect(() => {
    fetchCommentMessage()
  }, [])

  const handleOnScrollToBottom = () => {
    if (lastMessageId !== null) {
      fetchCommentMessage()
    }
  }

  const handleExit = () => {
    history.back()
    drop('comment-message-list')
  }

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="mx-8 my-4 flex justify-between items-center">
        <IconButton size="small" onClick={handleExit}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
      </div>
      <span className="mb-2 text-center text-lg">评论动态</span>
      <Divider />
      <div className="min-h-0 flex flex-col">
        {commentMessageList.length === 0 ? (
          <span className="my-4 text-center">你还没有任何点赞动态</span>
        ) : (
          <InfiniteScroll ref={ref} onScrollToBottom={handleOnScrollToBottom}>
            {commentMessageList.map((message, index) => (
              <CommentMessage
                key={index}
                actionUserId={message.actionUserId}
                actionUsername={message.actionUsername}
                actionUserAvatar={message.actionUserAvatar}
                actionContent={message.actionContent}
                actionCode={message.actionCode}
                actionTime={dateFormat(message.actionTime)}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}

export default CommentMessageList
