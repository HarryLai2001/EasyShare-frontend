import { useEffect, useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import MyAvatar from './MyAvatar'
import { DEFAULT_AVATAR } from '../../../constants/url'
import MyPostList from './MyPostList'
import MyViewLog from './MyViewLog'
import { Divider } from '@material-ui/core'
import MyFansList from './MyFansList'
import { ButtonBase } from '@mui/material'
import MyFollowsList from './MyFollowsList'
import { useActivate } from 'react-activation'

function MyProfile() {
  const [username, setUsername] = useState('用户名加载中...')
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [fansCnt, setFansCnt] = useState(0)
  const [isFansListOpen, setIsFansListOpen] = useState(false)
  const [followsCnt, setFollowsCnt] = useState(0)
  const [isFollowsListOpen, setIsFollowsListOpen] = useState(false)

  const [view, setView] = useState('my-post-list')

  const fetchMyInfo = () => {
    Api.get('/user/user-info')
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

  const fetchMyData = () => {
    Api.get('/user/user-data')
      .then((res) => {
        if (res.data.code === 1000) {
          setFansCnt(res.data.data.fansCnt)
          setFollowsCnt(res.data.data.followsCnt)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  useEffect(() => {
    fetchMyInfo()
    fetchMyData()
  }, [])

  useActivate(() => {
    fetchMyData()
  })

  return (
    <>
      <div className="min-h-0 flex-auto my-2 flex flex-col bg-[#fdfdfd]">
        <div className="mx-20 mt-2">
          <div className="ml-4 flex">
            <MyAvatar avatarSrc={avatar ? avatar : DEFAULT_AVATAR} handleOnUpdate={fetchMyInfo} />
            <div className="ml-6 flex flex-col">
              <span className="my-3 text-xl font-title">{username}</span>
              <div className="flex">
                <div className="mr-2 flex items-center">
                  <ButtonBase onClick={() => setIsFansListOpen(true)}>粉丝</ButtonBase>
                  <span className="ml-1 w-[30px]">{fansCnt}</span>
                </div>
                <div className="mr-2 flex items-center">
                  <ButtonBase onClick={() => setIsFollowsListOpen(true)}>关注</ButtonBase>{' '}
                  <span className="ml-1 w-[30px]">{followsCnt}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className={[
                'px-8 py-4 hover:text-blue-800 hover:border-b-2 hover:border-b-blue-800',
                view === 'my-post-list' ? 'text-blue-800 border-b-2 border-b-blue-800' : null
              ].join(' ')}
              onClick={() => setView('my-post-list')}
            >
              我的帖子
            </button>
            <button
              type="button"
              className={[
                'px-8 py-4 hover:text-blue-800 hover:border-b-2 hover:border-b-blue-800',
                view === 'my-view-log' ? 'text-blue-800 border-b-2 border-b-blue-800' : null
              ].join(' ')}
              onClick={() => setView('my-view-log')}
            >
              浏览记录
            </button>
          </div>
        </div>
        <Divider />
        {(() => {
          switch (view) {
            case 'my-post-list':
              return <MyPostList />
            case 'my-view-log':
              return <MyViewLog />
            default:
              return <MyPostList />
          }
        })()}
      </div>
      <MyFansList open={isFansListOpen} onClose={() => setIsFansListOpen(false)} />
      <MyFollowsList open={isFollowsListOpen} onClose={() => setIsFollowsListOpen(false)} />
    </>
  )
}

export default MyProfile
