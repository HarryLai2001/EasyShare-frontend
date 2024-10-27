import { Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR } from '../../constants/url'
import PropTypes from 'prop-types'

function FollowMessage({ actionUserId, actionUsername, actionUserAvatar, actionTime }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="w-full px-20 py-4 flex justify-between bg-white hover:bg-gray-50"
      onClick={() => navigate(`/user/${actionUserId}`)}
    >
      <div className="flex items-center">
        <Avatar sx={{ width: 40, height: 40 }}>
          <img
            src={actionUserAvatar ? actionUserAvatar : DEFAULT_AVATAR}
            style={{ maxWidth: `100%`, maxHeight: `100%` }}
          />
        </Avatar>
        <div className="ml-6 flex flex-col justify-around items-start">
          <span className="text-lg">{actionUsername ? actionUsername : '用户不存在'}</span>
          <span className="text-sm text-gray-500">关注了你</span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{actionTime}</span>
    </button>
  )
}

FollowMessage.propTypes = {
  postId: PropTypes.number,
  actionUserId: PropTypes.number,
  actionUsername: PropTypes.string,
  actionUserAvatar: PropTypes.string,
  actionTime: PropTypes.string
}

export default FollowMessage
