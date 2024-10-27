import { Button, InputBase } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

function PostContent({ content, isEditable, handleSubmitUpdate, handleCancelUpdate }) {
  const [editorContent, setEditorContent] = useState('')
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)

  useEffect(() => {
    setEditorContent(() => (isEditable ? content : ''))
  }, [isEditable])

  return (
    <div className="flex flex-col">
      <InputBase
        style={{
          width: `100%`,
          padding: `5px 10px`,
          border: isEditable ? `2px solid #4D74F0` : null,
          borderRadius: `5px`
        }}
        multiline={true}
        value={isEditable ? editorContent : content}
        onChange={(e) => setEditorContent(e.target.value)}
        readOnly={!isEditable}
        autoFocus={isEditable}
      />
      {isEditable ? (
        <div className="mt-2 self-end">
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: `0 10px`, padding: `2px 6px` }}
            onClick={async () => {
              flushSync(() => setIsSubmittingUpdate(true))
              await handleSubmitUpdate(editorContent)
              setIsSubmittingUpdate(false)
            }}
            disabled={editorContent === '' || isSubmittingUpdate}
          >
            {isSubmittingUpdate ? '保存中...' : '保存'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: `0 10px`, padding: `2px 6px` }}
            onClick={handleCancelUpdate}
          >
            取消
          </Button>
        </div>
      ) : null}
    </div>
  )
}

PostContent.propTypes = {
  content: PropTypes.string,
  isEditable: PropTypes.bool,
  handleSubmitUpdate: PropTypes.func,
  handleCancelUpdate: PropTypes.func
}
export default PostContent
