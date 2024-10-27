import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, IconButton, MenuList } from '@material-ui/core'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import { Avatar, Fade, Menu, MenuItem, OutlinedInput, Typography } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import toast from 'react-hot-toast'
import { DEFAULT_AVATAR } from '../../constants/url'
import sleep from '../../utils/sleep'
import PostContent from './PostContent'
import { useSelector } from 'react-redux'
import Api from '../../api'
import DateFormat from '../../utils/dateFormat'
import Comment from './Comment'
import KeepAlive, { useAliveController } from 'react-activation'
import { flushSync } from 'react-dom'

function PostDetail() {
  const { postId } = useParams()

  const [content, setContent] = useState('')
  const [authorId, setAuthorId] = useState(null)
  const [author, setAuthor] = useState('用户名加载中...')
  const [avatar, setAvatar] = useState('')
  const [lastUpdate, setLastUpdate] = useState('')
  const [viewsCnt, setViewsCnt] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCnt, setLikesCnt] = useState(0)
  const [commentsCnt, setCommentsCnt] = useState(0)
  const [commentContent, setCommentContent] = useState('')
  const [commentsArr, setCommentsArr] = useState([])

  const [settingAnchorEl, setSettingAnchorEl] = useState(null)
  const moreOpen = Boolean(settingAnchorEl)
  const [isEditable, setIsEditable] = useState(false)

  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const myUserId = useSelector((state) => state.myInfo.myUserId)

  const fetchPost = () => {
    Api.get('/post/post-detail', {
      params: {
        postId: parseInt(postId)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      if (res.data.code === 1000) {
        setContent(res.data.data.content)
        setAuthorId(res.data.data.authorId)
        setAuthor(res.data.data.author)
        setAvatar(res.data.data.avatar)
        setViewsCnt(res.data.data.viewsCnt)
        setIsLiked(res.data.data.isLiked)
        setLikesCnt(res.data.data.likesCnt)
        setCommentsCnt(res.data.data.commentsCnt)
        setLastUpdate(DateFormat(res.data.data.lastUpdate))
      } else {
        toast.error('内容获取失败，请重试')
      }
    })
  }

  const fetchComments = () => {
    Api.get('/comment/comments', {
      params: {
        postId: parseInt(postId)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      if (res.data.code === 1000) {
        setCommentsArr(res.data.data)
      } else {
        toast.error('内容获取失败，请重试')
      }
    })
  }

  useEffect(() => {
    fetchPost()
    fetchComments()
    setTimeout(() => {
      Api.post('/view/create', { postId: parseInt(postId) })
    }, 60 * 1000) // 页面停留1分钟以上才算浏览一次
  }, [])

  const handleOnLike = () => {
    Api.post('/like/create', {
      postId: parseInt(postId)
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setIsLiked(true)
          setLikesCnt(likesCnt + 1)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('操作失败，请重试')
      })
  }

  const handleOnCancelLike = () => {
    Api.post('/like/cancel', {
      postId: parseInt(postId)
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setIsLiked(false)
          setLikesCnt(likesCnt - 1)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('操作失败，请重试')
      })
  }

  const handleClickMore = (event) => {
    setSettingAnchorEl(event.currentTarget)
  }
  const handleCloseMore = () => {
    setSettingAnchorEl(null)
  }

  const handleEnableUpdate = () => {
    setIsEditable(true)
    handleCloseMore()
  }

  const handleDelete = () => {
    if (window.confirm('你确定要删除这条帖子吗？')) {
      handleCloseMore()
      Api.delete('/post/delete', {
        params: {
          postId: parseInt(postId)
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
        .then(async (res) => {
          if (res.data.code === 1000) {
            toast.success('删除成功')
            await sleep(3000)
            history.back()
          } else {
            toast.error(res.data.message)
          }
        })
        .catch(() => {
          toast.error('请求失败，请重试')
        })
    }
  }

  const handleSubmitUpdate = async (newContent) => {
    await Api.put('/post/update', {
      id: parseInt(postId),
      content: newContent
    })
      .then((res) => {
        if (res.data.code === 1000) {
          toast.success('保存成功')
          fetchPost()
          setIsEditable(false)
        } else {
          toast.error('保存失败，请重试')
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const handleCancelUpdate = () => {
    if (window.confirm('你确定要取消当前的修改吗？')) {
      setIsEditable(false)
    }
  }

  const handleSubmitComment = () => {
    flushSync(() => setIsSubmittingComment(true))
    Api.post('/comment/create', {
      postId: parseInt(postId),
      content: commentContent,
      parentId: null,
      toUserId: null
    })
      .then((res) => {
        if (res.data.code === 1000) {
          toast.success('评论发布成功')
          setCommentContent('')
          fetchPost()
          fetchComments()
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => {
        setIsSubmittingComment(false)
      })
  }

  const { drop } = useAliveController()
  const navigate = useNavigate()

  return (
    <KeepAlive
      id={`post-detail-${postId}`}
      name={`post-detail-${postId}`}
      cacheKey={`post-detail-${postId}`}
      autoFreeze
    >
      <div className="w-full h-[100vh] pt-4 bg-[#fdfdfd] flex flex-col">
        <div className="w-full mx-8 mb-4 flex justify-between">
          <IconButton
            size="small"
            onClick={() => {
              drop(`post-detail-${postId}`)
              history.back()
            }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          {authorId === myUserId ? (
            <>
              <IconButton size="small" onClick={handleClickMore}>
                <MoreHorizRoundedIcon />
              </IconButton>
              <Menu
                anchorEl={settingAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={moreOpen}
                onClose={handleCloseMore}
                TransitionComponent={Fade}
                slotProps={{
                  paper: {
                    sx: {
                      boxShadow: 2
                    }
                  }
                }}
              >
                <MenuList style={{ display: `flex`, flexDirection: `column`, padding: `0` }}>
                  <MenuItem
                    style={{ padding: `5px 10px` }}
                    onClick={handleEnableUpdate}
                    disabled={isEditable}
                  >
                    编辑
                  </MenuItem>
                  <MenuItem style={{ padding: `5px 10px` }} onClick={handleDelete}>
                    删除
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : null}
        </div>
        <div className="w-full px-32 mt-2 flex-auto flex flex-col overflow-y-auto">
          <div className="w-full flex items-center">
            <button type="button" onClick={() => navigate(`/user/${authorId}`)}>
              <Avatar sx={{ width: 50, height: 50 }}>
                <img
                  src={avatar ? avatar : DEFAULT_AVATAR}
                  style={{ maxWidth: `100%`, maxHeight: `100%` }}
                />
              </Avatar>
            </button>
            <div className="ml-4">
              <Typography fontSize={16}>{author}</Typography>
              <Typography fontSize={12} color="info">
                编辑于{lastUpdate}
              </Typography>
            </div>
          </div>

          <div className="w-full px-4 my-4 flex flex-col items-start">
            <div className="w-full my-2 font-regular">
              <PostContent
                content={content}
                isEditable={isEditable}
                handleSubmitUpdate={handleSubmitUpdate}
                handleCancelUpdate={handleCancelUpdate}
              />
            </div>
            <div className="my-4 flex items-center">
              <div className="mr-8 flex items-center">
                <IconButton
                  size="small"
                  onClick={isLiked ? handleOnCancelLike : handleOnLike}
                  disableRipple
                >
                  <ThumbUpIcon fontSize="small" color={isLiked ? 'info' : 'disabled'} />
                </IconButton>
                <span className="w-[20px] ml-1">{likesCnt}</span>
              </div>
              <div>{viewsCnt}次浏览</div>
            </div>
            <OutlinedInput
              style={{
                margin: `5px 0`,
                fontSize: `14px`
              }}
              placeholder="在这里发表评论"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              multiline={true}
              maxRows={4}
              margin="dense"
              fullWidth={true}
            />
            <Button
              variant="outlined"
              color="primary"
              style={{ alignSelf: `end`, width: `80px`, padding: `2px 0` }}
              size="small"
              disabled={commentContent === '' || isSubmittingComment}
              onClick={handleSubmitComment}
            >
              {isSubmittingComment ? '发布中...' : '发布'}
            </Button>
            <div className="w-full my-4 border-b-2">全部评论 {commentsCnt} 条</div>
            {commentsArr.length === 0 ? (
              <div className="w-full text-center">这条帖子还没有任何评论</div>
            ) : (
              <div className="w-full px-8">
                {commentsArr.map((comment, index) => (
                  <Comment
                    key={index}
                    id={comment.id}
                    postId={postId}
                    fromUserId={comment.fromUserId}
                    fromUsername={comment.fromUsername}
                    fromUserAvatar={comment.fromUserAvatar}
                    content={comment.content}
                    commentAt={DateFormat(comment.commentAt)}
                    childComments={comment.childComments}
                    isDeleted={comment.isDeleted}
                    handleOnUpdate={() => {
                      fetchPost()
                      fetchComments()
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </KeepAlive>
  )
}

export default PostDetail
