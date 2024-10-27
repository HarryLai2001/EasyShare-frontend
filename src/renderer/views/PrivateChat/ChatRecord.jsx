import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { throttle } from 'lodash'

function ChatRecord({ children, onScrollToTop, shouldScrollToBottom }) {
  const ref = useRef(null)
  const endRef = useRef(null)
  const [initialScroll, setInitialScroll] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleOnScrollToTop = throttle(async () => {
    if (initialScroll) {
      setInitialScroll(false)
      return
    }
    if (-ref.current?.scrollTop + ref.current?.clientHeight + 5 >= ref.current?.scrollHeight) {
      flushSync(() => setIsLoadingMore(true))
      await onScrollToTop()
      setIsLoadingMore(false)
    }
  }, 500)

  useEffect(() => {
    if (shouldScrollToBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [children])

  return (
    <div
      ref={ref}
      className="px-20 my-2 flex mb-auto flex-col-reverse overflow-y-auto"
      onScrollCapture={handleOnScrollToTop}
    >
      <div ref={endRef} />
      {children}
      <div className={['w-full', isLoadingMore ? 'flex justify-center' : 'hidden'].join(' ')}>
        <CircularProgress size={20} />
      </div>
    </div>
  )
}

ChatRecord.propTypes = {
  children: PropTypes.node,
  onScrollToTop: PropTypes.func,
  shouldScrollToBottom: PropTypes.bool
}

export default ChatRecord
