import { Button, InputAdornment } from '@material-ui/core'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from '../../../components/InfiniteScroll'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import PostCard from '../../../components/PostCard'
import Api from '../../../api'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import SearchIcon from '@material-ui/icons/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Divider, InputBase } from '@mui/material'
import { useActivate } from 'react-activation'
import dateFormat from '../../../utils/dateFormat'

function Discover() {
  const [posts, setPosts] = useState([])
  const [clickPostId, setClickPostId] = useState(-1)

  const ref = useRef(null)

  const navigate = useNavigate()

  const fetchHotPosts = () => {
    Api.get('/post/hot-posts', {
      params: {
        dateLimit: 7,
        pageSize: 100
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      if (res.data.code === 1000) {
        setPosts((posts) => [...posts, ...res.data.data])
      } else {
        toast.error(res.data.message)
      }
    })
  }

  useEffect(() => {
    fetchHotPosts()
  }, [])

  useActivate(() => {
    if (clickPostId !== -1) {
      Api.get('/post/post-detail', {
        params: {
          postId: clickPostId
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }).then((res) => {
        if (res.data.code === 1000) {
          setPosts(posts.map((post) => (post.id === clickPostId ? res.data.data : post)))
          return
        }
        if (res.data.code === 1001) {
          setPosts(posts.filter((post) => post.id != clickPostId)) // 未找到说明帖子已删除
        }
      })
    }
    setClickPostId(-1)
  })

  const handleRefresh = async () => {
    setPosts([])
    await fetchHotPosts()
    ref.current.scrollTop = 0
  }

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="mx-8 my-4 flex justify-between items-center">
        <div>
          <Button
            style={{ marginRight: `20px` }}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/discover/create-post')}
          >
            我要发帖
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            换一批
          </Button>
        </div>
        <InputBase
          style={{
            width: `300px`,
            padding: `2px 8px`,
            marginRight: `10px`,
            border: `2px solid`,
            borderRadius: `5px`,
            background: `#ffffff`
          }}
          placeholder="请输入关键字搜索"
          onClick={() => navigate('/dashboard/discover/search-posts')}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      <Divider />
      <InfiniteScroll onScrollToBottom={fetchHotPosts} ref={ref}>
        <ResponsiveMasonry
          style={{ padding: `20px 40px` }}
          columnsCountBreakPoints={{ 1200: 3, 800: 2, 400: 1 }}
        >
          <Masonry gutter="10px">
            {posts.map((post, index) => (
              <PostCard
                key={index}
                postId={post.id}
                author={post.author}
                avatar={post.avatar}
                content={post.content}
                isLiked={post.isLiked}
                likesCnt={post.likesCnt}
                lastUpdate={dateFormat(post.lastUpdate)}
                onClick={(postId) => setClickPostId(postId)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
    </div>
  )
}

export default Discover
