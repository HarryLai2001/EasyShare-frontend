import { CircularProgress } from '@mui/material'

function Loading() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <CircularProgress />
      <span className="my-4 text-xl">加载中...</span>
    </div>
  )
}

export default Loading
