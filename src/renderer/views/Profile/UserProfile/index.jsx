import { Avatar, Button, Divider } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DEFAULT_AVATAR } from '../../../constants/url'
import Api from '../../../api'
import toast from 'react-hot-toast'
import UserPostList from './UserPostList'

function UserProfile() {
  const { userId } = useParams()

  const [username, setUsername] = useState('用户名加载中...')
  const [avatar, setAvatar] = useState('')
  const [fansCnt, setFansCnt] = useState(0)
  const [followsCnt, setFollowsCnt] = useState(0)
  const [isFollowed, setIsFollowed] = useState(false)

  const fetchUserInfo = () => {
    Api.get('/user/user-info', {
      params: {
        userId: parseInt(userId)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setUsername(res.data.data.username)
          setAvatar(res.data.data.avatar)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const fetchUserData = () => {
    Api.get('/user/user-data', {
      params: {
        userId: parseInt(userId)
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setFansCnt(res.data.data.fansCnt)
          setFollowsCnt(res.data.data.followsCnt)
          setIsFollowed(res.data.data.isFollowed)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const handleOnFollow = () => {
    Api.post('/follow/create', {
      followeeId: parseInt(userId)
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setIsFollowed(true)
          setFollowsCnt(followsCnt + 1)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const handleOnCancelFollow = () => {
    Api.post('/follow/cancel', {
      followeeId: parseInt(userId)
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setIsFollowed(false)
          setFollowsCnt(followsCnt - 1)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  useEffect(() => {
    fetchUserInfo()
    fetchUserData()
  }, [])

  const navigate = useNavigate()

  return (
    <div className="min-h-0 flex-auto flex flex-col bg-[#fdfdfd]">
      <div className="mx-20 mb-4 flex justify-between items-end">
        <div className="ml-4 my-2 flex items-center">
          <Avatar sx={{ width: 80, height: 80 }}>
            <img
              src={avatar ? avatar : DEFAULT_AVATAR}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </Avatar>
          <div className="ml-6 flex flex-col">
            <span className="my-3 text-xl font-title">{username}</span>
            <div>
              <span className="mr-6">粉丝 {fansCnt}</span>
              <span className="mr-6">关注 {followsCnt}</span>
            </div>
          </div>
        </div>
        <div className="mr-24 mb-4">
          <Button
            variant="outlined"
            style={{ width: `80px`, padding: `4px 4px`, margin: `0 10px` }}
            color={isFollowed ? 'error' : 'primary'}
            onClick={isFollowed ? handleOnCancelFollow : handleOnFollow}
          >
            {isFollowed ? '取消关注' : '关注'}
          </Button>
          <Button
            variant="outlined"
            style={{ width: `80px`, padding: `4px 4px`, margin: `0 10px` }}
            onClick={() => navigate(`/private-chat/${userId}`)}
          >
            私信TA
          </Button>
        </div>
      </div>
      <span className="ml-24 my-2 text-lg text-gray-500 font-regular">TA的帖子</span>
      <Divider />
      <UserPostList userId={parseInt(userId)} />
    </div>
  )
}

export default UserProfile
