import { Avatar, ButtonBase, OutlinedInput } from '@material-ui/core'
import { Button, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Api from '../../api'
import toast from 'react-hot-toast'
import { DEFAULT_AVATAR } from '../../constants/url'
import { useSelector } from 'react-redux'
import dateFormat from '../../utils/dateFormat'
import { useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'

function Comment({
  id,
  postId,
  fromUserId,
  fromUsername,
  fromUserAvatar,
  content,
  commentAt,
  childComments,
  isDeleted,
  handleOnUpdate
}) {
  const [isReplyShow, setIsReplyShow] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyTo, setReplyTo] = useState(-1)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const myUserId = useSelector((state) => state.myInfo.myUserId)

  const handleOnReply = (index) => {
    setReplyTo(index)
    setIsReplyShow(true)
  }

  const handleSubmitCommentReply = () => {
    flushSync(() => setIsSubmittingReply(true))
    Api.post('/comment/create', {
      postId: postId,
      content: replyContent,
      parentId: id,
      toUserId: replyTo !== -1 ? childComments[replyTo].fromUserId : null
    })
      .then((res) => {
        if (res.data.code === 1000) {
          toast.success('评论发布成功')
          setIsReplyShow(false)
          handleOnUpdate()
          setReplyContent('')
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => {
        setIsSubmittingReply(false)
        setReplyTo(-1)
      })
  }

  const handleDeleteComment = (commentId) => {
    if (window.confirm('你确定要删除这条评论吗？')) {
      Api.delete('/comment/delete', {
        params: {
          commentId: commentId
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
        .then((res) => {
          if (res.data.code === 1000) {
            toast.success('删除评论成功')
            handleOnUpdate()
          } else {
            toast.error(res.data.message)
          }
        })
        .catch(() => {
          toast.error('请求失败，请重试')
        })
    }
  }

  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col">
      <div className="my-2 flex items-start">
        <button type="button" onClick={() => navigate(`/user/${fromUserId}`)}>
          <Avatar sx={{ width: 40, height: 40 }}>
            <img
              src={fromUserAvatar ? fromUserAvatar : DEFAULT_AVATAR}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </Avatar>
        </button>
        <div className="ml-4">
          <span className="text-gray-400">{fromUsername}</span>
          <Typography>
            {isDeleted ? <span className="text-gray-500">该评论已被删除</span> : <>{content}</>}
          </Typography>
          <Typography fontSize={12} color="info">
            {commentAt}
            {isDeleted ? null : (
              <>
                <ButtonBase style={{ marginLeft: `10px` }} onClick={() => handleOnReply(-1)}>
                  回复
                </ButtonBase>
                {myUserId === fromUserId ? (
                  <ButtonBase
                    style={{ marginLeft: `10px` }}
                    onClick={() => handleDeleteComment(id)}
                  >
                    删除
                  </ButtonBase>
                ) : null}
              </>
            )}
          </Typography>
        </div>
      </div>
      {childComments.length > 0 &&
        childComments.map((comment, index) => (
          <div key={index} className="my-2 ml-16 flex items-start">
            <button type="button" onClick={() => navigate(`/user/${comment.fromUserId}`)}>
              <Avatar sx={{ width: 40, height: 40 }}>
                <img
                  src={comment.fromUserAvatar ? comment.fromUserAvatar : DEFAULT_AVATAR}
                  style={{ maxWidth: `100%`, maxHeight: `100%` }}
                />
              </Avatar>
            </button>
            <div className="ml-4">
              <span className="text-gray-400">{comment.fromUsername}</span>
              <Typography>
                {comment.toUserId ? (
                  <>
                    回复<span className="text-gray-400">{comment.toUsername}</span>:
                  </>
                ) : null}{' '}
                {comment.isDeleted ? (
                  <span className="text-gray-500">该评论已被删除</span>
                ) : (
                  <>{comment.content}</>
                )}
              </Typography>
              <Typography fontSize={12} color="info">
                {dateFormat(comment.commentAt)}
                {comment.isDeleted ? null : (
                  <>
                    <ButtonBase style={{ marginLeft: `10px` }} onClick={() => handleOnReply(index)}>
                      回复
                    </ButtonBase>
                    {myUserId === comment.fromUserId ? (
                      <ButtonBase
                        style={{ marginLeft: `10px` }}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        删除
                      </ButtonBase>
                    ) : null}
                  </>
                )}
              </Typography>
            </div>
          </div>
        ))}
      <div
        className="w-full flex flex-col overflow-hidden duration-300"
        style={{ maxHeight: isReplyShow ? `100px` : `0` }}
      >
        <OutlinedInput
          style={{
            margin: `5px 0`,
            fontSize: `14px`
          }}
          multiline={true}
          maxRows={4}
          fullWidth={true}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={replyTo !== -1 ? `回复${childComments[replyTo].fromUsername}：` : null}
        />
        <div className="self-end">
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: `0 4px`, width: `70px` }}
            size="small"
            onClick={handleSubmitCommentReply}
            disabled={replyContent === '' || isSubmittingReply}
          >
            {isSubmittingReply ? '回复中...' : '回复'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: `0 4px`, width: `70px` }}
            size="small"
            onClick={() => setIsReplyShow(false)}
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  )
}

Comment.propTypes = {
  id: PropTypes.number,
  postId: PropTypes.number,
  fromUserId: PropTypes.number,
  fromUsername: PropTypes.string,
  fromUserAvatar: PropTypes.string,
  content: PropTypes.string,
  commentAt: PropTypes.string,
  likesCnt: PropTypes.number,
  childComments: PropTypes.array,
  isDeleted: PropTypes.bool,
  handleOnUpdate: PropTypes.func
}

export default Comment
