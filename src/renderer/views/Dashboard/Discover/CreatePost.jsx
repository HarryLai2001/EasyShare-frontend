import { useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import sleep from '../../../utils/sleep'
import { Button, IconButton } from '@material-ui/core'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { useAliveController } from 'react-activation'
import { flushSync } from 'react-dom'

function CreatePost() {
  const [editorContent, setEditorContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const { drop } = useAliveController()

  const handleOnPost = () => {
    flushSync(() => setIsPosting(true))
    Api.post('/post/create', {
      content: editorContent
    })
      .then(async (res) => {
        if (res.data.code === 1000) {
          toast.success('发布成功')
          await sleep(3000)
          drop('my-profile')
          history.back()
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => setIsPosting(false))
  }

  const handleOnExit = () => {
    if (!editorContent || window.confirm('离开后已编辑的内容将会丢失，是否继续？')) {
      drop('create-post')
      history.back()
    }
  }

  return (
    <div className="w-full">
      <div className="w-full px-4 py-2 flex flex-col items-center">
        <IconButton
          size="small"
          onClick={handleOnExit}
          style={{
            alignSelf: `self-start
            `
          }}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <div className="mx-8 mt-6 mb-4 self-stretch border-2 border-gray-200 rounded bg-white flex flex-col items-start">
          <textarea
            className="px-4 py-2 self-stretch outline-none"
            placeholder="请输入分享内容"
            rows={8}
            maxLength={1000}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            autoFocus
          />
          <IconButton size="small">
            <AddPhotoAlternateIcon style={{ fontSize: 60, margin: `10px 10px` }} />
          </IconButton>
        </div>
        <Button
          variant="outlined"
          color="primary"
          style={{
            width: `100px`,
            padding: `2px 4px`,
            marginRight: `30px`,
            alignSelf: `self-end`
          }}
          disabled={editorContent === '' || isPosting}
          onClick={handleOnPost}
        >
          {isPosting ? '发布中...' : '点击发布'}
        </Button>
      </div>
    </div>
  )
}

export default CreatePost
