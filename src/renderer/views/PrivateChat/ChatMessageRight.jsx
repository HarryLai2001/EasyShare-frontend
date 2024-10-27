import { Avatar } from '@material-ui/core'
import { DEFAULT_AVATAR } from '../../constants/url'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './ChatMessageStyle.module.css'

function ChatMessageRight({ userId, avatar, content, sendAt }) {
  const navigate = useNavigate()
  return (
    <div className="my-2 flex items-start relative self-end">
      <div className="flex flex-col items-end">
        <div className={styles.right}>{content}</div>
        <span className="mr-6 mt-1 text-[12px] text-gray-400">{sendAt}</span>
      </div>
      <button type="button" onClick={() => navigate(`/user/${userId}`)}>
        <Avatar sx={{ width: 40, height: 40 }}>
          <img
            src={avatar ? avatar : DEFAULT_AVATAR}
            style={{ maxWidth: `100%`, maxHeight: `100%` }}
          />
        </Avatar>
      </button>
    </div>
  )
}

ChatMessageRight.propTypes = {
  userId: PropTypes.number,
  avatar: PropTypes.string,
  content: PropTypes.string,
  sendAt: PropTypes.string
}

export default ChatMessageRight
