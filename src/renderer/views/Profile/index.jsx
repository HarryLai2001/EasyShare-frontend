import { IconButton } from '@mui/material'
import KeepAlive, { useAliveController } from 'react-activation'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MyProfile from './MyProfile'
import UserProfile from './UserProfile'

function Profile() {
  const { userId } = useParams()
  const myUserId = useSelector((state) => state.myInfo.myUserId)

  const { drop } = useAliveController()

  return (
    <KeepAlive
      id={`user-profile-${userId}`}
      name={`user-profile-${userId}`}
      cacheKey={`user-profile-${userId}`}
      autoFreeze
    >
      <div className="h-[100vh] min-h-0 flex flex-col bg-[#fdfdfd]">
        <div className="mx-8 mt-4 mb-2 flex justify-between">
          <IconButton
            size="small"
            onClick={() => {
              drop(`user-profile-${userId}`)
              history.back()
            }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <IconButton size="small">
            <MoreHorizRoundedIcon />
          </IconButton>
        </div>
        {parseInt(userId) === myUserId ? <MyProfile /> : <UserProfile />}
      </div>
    </KeepAlive>
  )
}

export default Profile
