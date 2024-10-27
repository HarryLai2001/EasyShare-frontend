import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Card, CardContent, Typography } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import PropTypes from 'prop-types'
import { DEFAULT_AVATAR } from '../constants/url'

function PostCard({ postId, author, avatar, content, isLiked, likesCnt, lastUpdate, onClick }) {
  const [isHovering, setIsHovering] = useState(false)

  const navigate = useNavigate()

  const handleOnClick = () => {
    onClick(postId)
    navigate(`/post/${postId}`)
  }

  return (
    <Card
      style={{
        margin: `5px 5px`,
        cursor: `pointer`,
        boxShadow: isHovering ? `0 0 10px rgba(0, 0, 0, 0.2)` : null
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleOnClick}
    >
      <CardContent>
        <div className="w-full flex items-center">
          <Avatar sx={{ width: 40, height: 40 }}>
            <img
              src={avatar ? avatar : DEFAULT_AVATAR}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </Avatar>
          <div className="ml-4">
            <Typography fontSize={16}>{author}</Typography>
            <Typography fontSize={12} color="info">
              编辑于{lastUpdate}
            </Typography>
          </div>
        </div>
        <Typography
          style={{
            margin: `20px 10px`,
            overflow: `hidden`,
            textOverflow: `ellipsis`,
            display: `-webkit-box`,
            WebkitLineClamp: 10,
            WebkitBoxOrient: `vertical`,
            whiteSpace: `pre-wrap`, // 保留空白字符与换行符，正常换行
            wordBreak: `break-word`
          }}
        >
          {content}
        </Typography>
        <div className="mt-4 flex items-center">
          <ThumbUpIcon fontSize="small" color={isLiked ? 'info' : 'disabled'} />
          <span className="w-[30px] ml-1">{likesCnt}</span>
        </div>
      </CardContent>
    </Card>
  )
}

PostCard.propTypes = {
  postId: PropTypes.number,
  authorId: PropTypes.number,
  author: PropTypes.string,
  avatar: PropTypes.string,
  content: PropTypes.string,
  isLiked: PropTypes.bool,
  likesCnt: PropTypes.number,
  lastUpdate: PropTypes.string,
  onClick: PropTypes.func
}

export default PostCard
