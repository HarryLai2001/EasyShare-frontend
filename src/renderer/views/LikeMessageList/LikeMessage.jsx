import { Avatar } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR } from '../../constants/url'
import PropTypes from 'prop-types'
import { useRef } from 'react'

function LikeMessage({
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
          <span className="text-sm text-gray-500">赞了你的帖子</span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{actionTime}</span>
    </button>
  )
}

LikeMessage.propTypes = {
  actionUserId: PropTypes.number,
  actionUsername: PropTypes.string,
  actionUserAvatar: PropTypes.string,
  actionContent: PropTypes.object,
  actionTime: PropTypes.string
}

export default LikeMessage
