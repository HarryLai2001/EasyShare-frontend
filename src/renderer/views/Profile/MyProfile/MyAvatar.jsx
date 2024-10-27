import { Button, Modal } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import sleep from '../../../utils/sleep'
import { flushSync } from 'react-dom'

function MyAvatar({ avatarSrc, handleOnUpdate }) {
  const [isAvatarHovering, setIsAvatarHovering] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [imgFile, setImgFile] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImgUrl(reader.result)
      }
      reader.readAsDataURL(imgFile)
    }
  }, [imgFile])

  const handleUpdateAvatar = async () => {
    flushSync(() => setIsUpdating(true))
    const formdata = new FormData()
    formdata.append('avatar', imgFile)
    await Api.put(
      '/user/update-avatar',
      {
        avatar: formdata.get('avatar')
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
      .then(async (res) => {
        if (res.data.code === 1000) {
          toast.success('头像修改成功')
          await sleep(3000)
          await handleOnUpdate()
          handleCloseModal()
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => setIsUpdating(false))
  }

  const handleCloseModal = () => {
    setImgFile(null)
    setImgUrl(null)
    setIsAvatarModalOpen(false)
  }

  return (
    <>
      <img
        src={avatarSrc}
        style={{
          width: 80,
          height: 80,
          borderRadius: `50%`,
          padding: `2px`,
          boxShadow: isAvatarHovering ? `0 0 4px #2980b9` : null,
          cursor: `pointer`
        }}
        onMouseOver={() => setIsAvatarHovering(true)}
        onMouseLeave={() => setIsAvatarHovering(false)}
        onClick={() => setIsAvatarModalOpen(true)}
      />
      <Modal open={isAvatarModalOpen} onClose={handleCloseModal}>
        <div className="w-[350px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-16 py-8 rounded-md shadow-md flex flex-col items-center">
          <span className="mb-4 text-lg">设置头像</span>
          <div className="w-[150px] h-[150px] my-4 mx-4 flex justify-center items-center">
            <img
              src={imgUrl ? imgUrl : avatarSrc}
              style={{ maxWidth: `100%`, maxHeight: `100%` }}
            />
          </div>
          <div className="w-full mt-8 flex justify-around">
            <Button style={{ width: 100 }} variant="outlined">
              <label htmlFor="uploadAvatar" className="relative text-[12px]">
                本地选择
                <input
                  type="file"
                  id="uploadAvatar"
                  className="w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer text-[0]"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={(e) => setImgFile(e.target.files[0])}
                />
              </label>
            </Button>
            <Button
              style={{ width: 100 }}
              variant="outlined"
              disabled={!imgFile || isUpdating}
              onClick={handleUpdateAvatar}
            >
              {isUpdating ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

MyAvatar.propTypes = {
  avatarSrc: PropTypes.string,
  handleOnUpdate: PropTypes.func
}

export default MyAvatar
