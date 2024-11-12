import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton } from '@material-ui/core'
import { Menu, MenuItem, MenuList, Fade, Badge } from '@mui/material'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import TextsmsIcon from '@mui/icons-material/Textsms'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useAliveController } from 'react-activation'
import Api from '../../api'
import socket from '../../socketio'
import { useDispatch, useSelector } from 'react-redux'
import { setConnectState } from '../../store/modules/socketStateStore'

function Dashboard() {
  const [settingAnchorEl, setSettingAnchorEl] = useState(null)
  const settingOpen = Boolean(settingAnchorEl)

  const likeMessageCnt = useSelector((state) => state.systemMessageCount.unreadLikeMessageCount)
  const followMessageCnt = useSelector((state) => state.systemMessageCount.unreadFollowMessageCount)
  const commentMessageCnt = useSelector(
    (state) => state.systemMessageCount.unreadCommentMessageCount
  )
  const unreadChatMessageTotalCount = useSelector(
    (state) => state.chatMessage.unreadChatMessageTotalCount
  )

  const navigate = useNavigate()
  const { clear } = useAliveController()

  const handleClickSetting = (event) => {
    setSettingAnchorEl(event.currentTarget)
  }
  const handleCloseSetting = () => {
    setSettingAnchorEl(null)
  }

  const dispatch = useDispatch()

  const handleLogout = async () => {
    socket.disconnect()
    dispatch(setConnectState(false))
    await Api.put('/user/logout')
    sessionStorage.removeItem('token')
    clear() // 退出登录时清空所有缓存中的KeepAlive
    window.api.setLoginWindow()
    window.location.hash = '/login'
  }

  return (
    <div className="w-full h-[100vh] flex">
      <div className="w-[150px] h-[100vh] bg-gray-50 relative flex flex-col">
        <div className="mt-8 self-center font-logo text-blue-900 text-4xl">易享</div>
        <div className="w-full mt-8 flex flex-col items-start">
          <NavLink
            to="/dashboard/discover"
            className={({ isActive }) =>
              [
                'w-full py-2 flex items-center hover:text-blue-900',
                isActive ? 'text-blue-900' : 'text-gray-500'
              ].join(' ')
            }
          >
            <TravelExploreIcon style={{ marginLeft: `40px`, fontSize: 25 }} />
            <span className="ml-4 text-lg font-regular">发现</span>
          </NavLink>
          <NavLink
            to="/dashboard/message"
            className={({ isActive }) =>
              [
                'w-full py-2 flex items-center hover:text-blue-900',
                isActive ? 'text-blue-900' : 'text-gray-500'
              ].join(' ')
            }
          >
            <Badge
              badgeContent={
                likeMessageCnt + followMessageCnt + commentMessageCnt + unreadChatMessageTotalCount
              }
              color="error"
            >
              <TextsmsIcon style={{ marginLeft: `40px`, fontSize: 25 }} />
            </Badge>
            <span className="ml-4 text-lg font-regular">消息</span>
          </NavLink>
          <NavLink
            to="/dashboard/my-profile"
            className={({ isActive }) =>
              [
                'w-full py-2 flex items-center hover:text-blue-900',
                isActive ? 'text-blue-900' : 'text-gray-500'
              ].join(' ')
            }
          >
            <PersonOutlineIcon style={{ marginLeft: `40px`, fontSize: 25 }} />
            <span className="ml-4 text-lg font-regular">我的</span>
          </NavLink>
        </div>
        <IconButton
          style={{
            position: `absolute`,
            bottom: `20px`,
            left: `20px`
          }}
          size="small"
          onClick={handleClickSetting}
        >
          <SettingsIcon style={{ fontSize: 25 }} />
        </IconButton>
        <Menu
          anchorEl={settingAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={settingOpen}
          onClose={handleCloseSetting}
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
              onClick={() => {
                handleCloseSetting()
                navigate('/dashboard/account-setting')
              }}
            >
              账号设置
            </MenuItem>
            <MenuItem style={{ padding: `5px 10px` }} onClick={handleLogout}>
              退出登录
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="min-w-[600px] h-[100vh] bg-[#fdfdfd] flex-auto flex relative">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
