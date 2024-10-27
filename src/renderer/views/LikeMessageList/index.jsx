import { Divider, IconButton } from '@material-ui/core'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { useEffect, useRef, useState } from 'react'
import Api from '../../api'
import toast from 'react-hot-toast'
import LikeMessage from './LikeMessage'
import dateFormat from '../../utils/dateFormat'
import { useAliveController } from 'react-activation'
import InfiniteScroll from '../../components/InfiniteScroll'

function LikeMessageList() {
  const [likeMessageList, setLikeMessageList] = useState([])
  const [lastMessageId, setLastMessageId] = useState(null)

  const ref = useRef(null)

  const { drop } = useAliveController()

  const fetchLikeMessage = () => {
    Api.get('/system-message/like-list', {
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
          setLikeMessageList((prev) => [...prev, ...res.data.data])
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
    fetchLikeMessage()
  }, [])

  const handleOnScrollToBottom = () => {
    if (lastMessageId !== null) {
      fetchLikeMessage()
    }
  }

  const handleExit = () => {
    history.back()
    drop('like-message-list')
  }

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="mx-8 my-4 flex justify-between items-center">
        <IconButton size="small" onClick={handleExit}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
      </div>
      <span className="mb-2 text-center text-lg">点赞动态</span>
      <Divider />
      <div className="min-h-0 flex flex-col">
        {likeMessageList.length === 0 ? (
          <span className="my-4 text-center">你还没有任何点赞动态</span>
        ) : (
          <InfiniteScroll ref={ref} onScrollToBottom={handleOnScrollToBottom}>
            {likeMessageList.map((message, index) => (
              <LikeMessage
                key={index}
                actionUserId={message.actionUserId}
                actionUsername={message.actionUsername}
                actionUserAvatar={message.actionUserAvatar}
                actionCode={message.actionCode}
                actionContent={message.actionContent}
                actionTime={dateFormat(message.actionTime)}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}

export default LikeMessageList
