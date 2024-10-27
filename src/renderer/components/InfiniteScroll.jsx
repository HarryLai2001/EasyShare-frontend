import { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'
import { throttle } from 'lodash'
import { flushSync } from 'react-dom'

const InfiniteScroll = forwardRef(function InfiniteScroll(
  { children, style, onScrollToBottom },
  ref
) {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleOnScrollToBottom = throttle(async () => {
    /* console.log(ref.current?.scrollTop)
    console.log(ref.current?.clientHeight)
    console.log(ref.current?.scrollHeight) */
    /* 滚动到底部时（滚动条距离顶部 + 可视区域 + 5 >= 滚动条内容的总高度）加载数据 */
    if (ref.current?.scrollTop + ref.current?.clientHeight + 5 >= ref.current?.scrollHeight) {
      flushSync(() => setIsLoadingMore(true))
      await onScrollToBottom()
      setIsLoadingMore(false)
    }
  }, 500)

  return (
    <div
      className="w-full flex-auto overflow-y-auto"
      ref={ref}
      onScrollCapture={handleOnScrollToBottom}
      style={{ ...style }}
    >
      {children}
      <div className={['w-full', isLoadingMore ? 'flex justify-center' : 'hidden'].join(' ')}>
        <CircularProgress size={20} />
      </div>
    </div>
  )
})

InfiniteScroll.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  onScrollToBottom: PropTypes.func
}

export default InfiniteScroll
