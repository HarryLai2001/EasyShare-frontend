import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { throttle } from 'lodash'

const ChatRecord = forwardRef(function ChatRecord({ children, onScrollToTop }, ref) {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const scrollRef = useRef(null)
  const endRef = useRef(null)

  useImperativeHandle(ref, () => ({
    scrollToBottom: (value) => setShouldScrollToBottom(value)
  }))

  const handleOnScrollToTop = throttle(async () => {
    if (
      -scrollRef.current?.scrollTop + scrollRef.current?.clientHeight + 5 >=
      scrollRef.current?.scrollHeight
    ) {
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
      ref={scrollRef}
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
})

ChatRecord.propTypes = {
  children: PropTypes.node,
  onScrollToTop: PropTypes.func,
  shouldScrollToBottom: PropTypes.bool
}

export default ChatRecord
