import { Avatar, IconButton, List, ListItemButton, Modal } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import { DEFAULT_AVATAR } from '../../../constants/url'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from '../../../components/InfiniteScroll'

function MyFansList({ open, onClose }) {
  const [fans, setFans] = useState([])
  const [lastFollowId, setLastFollowId] = useState(null)

  const ref = useRef(null)

  const fetchMyFans = () => {
    Api.get('/follow/fans-list', {
      params: {
        lastId: lastFollowId,
        pageSize: 10
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          if (res.data.data.length === 0) {
            setLastFollowId(null)
            return
          }
          setFans([...fans, ...res.data.data])
          setLastFollowId(res.data.data.at(-1).id)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  useEffect(() => {
    if (open) {
      fetchMyFans()
    }
  }, [open])

  const navigate = useNavigate()

  const handleOnScrollToBottom = () => {
    if (lastFollowId !== null) {
      fetchMyFans()
    }
  }

  const handleOnClose = () => {
    onClose()
    setFans([])
  }

  return (
    <Modal open={open} onClose={handleOnClose} >
      <div
        className={[
          'h-[100vh] absolute right-0 bg-gray-50 flex flex-col duration-300',
          open ? 'w-[250px]' : 'w-0 hidden'
        ].join(' ')}
      >
        <IconButton style={{ alignSelf: `end` }} size="small" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
        <span className="mb-4 text-center font-regular text-xl text-blue-900">我的粉丝</span>
        {fans.length === 0 ? (
          <div className="text-center mt-8">你还没有任何粉丝</div>
        ) : (
          <InfiniteScroll ref={ref} onScrollToBottom={handleOnScrollToBottom}>
            <List className="w-full flex flex-col overflow-y-auto">
              {fans.map((follow, index) => (
                <ListItemButton
                  key={index}
                  variant="text"
                  disableElevation
                  style={{
                    width: `100%`,
                    padding: `5px 30px`,
                    display: `flex`,
                    justifyContent: `start`,
                    alignItems: `center`
                  }}
                  onClick={() => {
                    navigate(`/user/${follow.userId}`)
                    onClose()
                  }}
                >
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <img
                      src={follow.avatar ? follow.avatar : DEFAULT_AVATAR}
                      style={{ maxWidth: `100%`, maxHeight: `100%` }}
                    />
                  </Avatar>
                  <span className="ml-4 w-[150px] text-left">{follow.username}</span>
                </ListItemButton>
              ))}
            </List>
          </InfiniteScroll>
        )}
      </div>
    </Modal>
  )
}

MyFansList.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default MyFansList
