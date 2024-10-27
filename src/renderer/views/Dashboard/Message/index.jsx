import { Badge, Divider } from '@material-ui/core'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import PersonIcon from '@mui/icons-material/Person'
import TextsmsIcon from '@mui/icons-material/Textsms'
import Api from '../../../api'
import Chat from './Chat'
import dateFormat from '../../../utils/dateFormat'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { countsReset } from '../../../store/modules/systemMessageCountStore'

function Message() {
  const likeMessageCount = useSelector((state) => state.systemMessageCount.unreadLikeMessageCount)
  const followMessageCount = useSelector(
    (state) => state.systemMessageCount.unreadFollowMessageCount
  )
  const commentMessageCount = useSelector(
    (state) => state.systemMessageCount.unreadCommentMessageCount
  )
  const chatList = useSelector((state) => state.chatMessage.chatList)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClickLikeMessageList = () => {
    navigate('/message/like-message-list')
    if (likeMessageCount > 0) {
      Api.put('/system-message/like-read')
      dispatch(countsReset('like'))
    }
  }

  const handleClickFollowMessageList = () => {
    navigate('/message/follow-message-list')
    if (followMessageCount > 0) {
      Api.put('/system-message/follow-read')
      dispatch(countsReset('follow'))
    }
  }

  const handleClickCommentMessageList = () => {
    navigate('/message/comment-message-list')
    if (commentMessageCount > 0) {
      Api.put('/system-message/comment-read')
      dispatch(countsReset('comment'))
    }
  }

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="mt-8 text-xl font-regular text-center">我的消息</div>
      <div className="mx-8 my-4 flex justify-around">
        <button
          className="px-8 py-2 rounded-lg flex flex-col items-center hover:bg-gray-50"
          onClick={handleClickLikeMessageList}
        >
          <Badge badgeContent={likeMessageCount} color="error">
            <ThumbUpIcon fontSize="large" color="primary" />
          </Badge>
          <span className="my-2">点赞</span>
        </button>
        <button
          className="px-8 py-2 rounded-lg flex flex-col items-center hover:bg-gray-50"
          onClick={handleClickFollowMessageList}
        >
          <Badge badgeContent={followMessageCount} color="error">
            <PersonIcon fontSize="large" color="primary" />
          </Badge>
          <span className="my-2">关注</span>
        </button>
        <button
          className="px-8 py-2 rounded-lg flex flex-col items-center hover:bg-gray-50"
          onClick={handleClickCommentMessageList}
        >
          <Badge badgeContent={commentMessageCount} color="error">
            <TextsmsIcon fontSize="large" color="primary" />
          </Badge>
          <span className="my-2">评论</span>
        </button>
      </div>
      <Divider />
      <div className="w-full flex flex-col overflow-y-auto">
        {chatList.length === 0 ? (
          <span className=" my-4 text-center">你还没有收到任何消息</span>
        ) : (
          <>
            {chatList.map((chat, index) => (
              <Chat
                key={index}
                userId={chat.userId}
                username={chat.username}
                avatar={chat.avatar}
                content={chat.content}
                sendAt={dateFormat(chat.sendAt)}
                unreadCount={chat.unreadCount}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Message
