import { Avatar } from '@mui/material'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR } from '../../constants/url'
import PropTypes from 'prop-types'

function CommentMessage({
  actionUserId,
  actionUsername,
  actionUserAvatar,
  actionContent,
  actionTime
}) {
  const avatarRef = useRef(null)

  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="w-full px-20 py-4 flex justify-between bg-white hover:bg-gray-50"
      onClick={(e) => {
        if (!avatarRef.current.contains(e.target)) {
          navigate(`/post/${actionContent.postId}`)
        }
      }}
    >
      <div className="flex items-center">
        <button
          type="button"
          ref={avatarRef}
          className="z-10"
          onClick={() => navigate(`/user/${actionUserId}`)}
        >
          <Avatar sx={{ width: 40, height: 40 }}>
            <img
              src={actionUserAvatar ? actionUserAvatar : DEFAULT_AVATAR}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </Avatar>
        </button>
        <div className="ml-6 flex flex-col justify-around items-start">
          <span className="text-lg">{actionUsername ? actionUsername : '用户不存在'}</span>

          <span className="text-sm">
            {actionContent.toUserId ? '回复了你：' : '评论了你：'}
            <span className="max-w-[400px] text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {actionContent.content}
            </span>
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{actionTime}</span>
    </button>
  )
}

CommentMessage.propTypes = {
  actionUserId: PropTypes.number,
  actionUsername: PropTypes.string,
  actionUserAvatar: PropTypes.string,
  actionContent: PropTypes.object,
  actionTime: PropTypes.string
}

export default CommentMessage
