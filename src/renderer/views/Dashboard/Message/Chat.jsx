import { Avatar, Badge } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR } from '../../../constants/url'
import PropTypes from 'prop-types'

function Chat({ userId, username, avatar, content, sendAt, unreadCount }) {
  const navigate = useNavigate()

  return (
    <button
      className="w-full px-12 py-4 flex justify-between bg-white hover:bg-gray-50"
      onClick={() => navigate(`/private-chat/${userId}`)}
    >
      <div className="w-full flex items-center">
        <Badge badgeContent={unreadCount} color="error">
          <Avatar sx={{ width: 40, height: 40 }} style={{ flex: `none` }}>
            <img
              src={avatar ? avatar : DEFAULT_AVATAR}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </Avatar>
        </Badge>
        <div className="ml-10 mr-12 flex flex-col justify-around items-start">
          <span className="text-lg">{username ? username : '用户不存在'}</span>
          <span className="max-w-[400px] text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {content}
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-500 flex-none">{sendAt}</span>
    </button>
  )
}

Chat.propTypes = {
  userId: PropTypes.number,
  username: PropTypes.string,
  avatar: PropTypes.string,
  content: PropTypes.string,
  sendAt: PropTypes.string,
  unreadCount: PropTypes.number
}

export default Chat
