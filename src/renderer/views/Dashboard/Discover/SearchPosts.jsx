import { IconButton, InputAdornment } from '@material-ui/core'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import Api from '../../../api'
import toast from 'react-hot-toast'
import { useRef, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { InputBase } from '@mui/material'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useActivate, useAliveController } from 'react-activation'
import InfiniteScroll from '../../../components/InfiniteScroll'
import PostCard from '../../../components/PostCard'
import dateFormat from '../../../utils/dateFormat'

function SearchPosts() {
  const [posts, setPosts] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [lastPostId, setLastPostId] = useState(null)
  const [clickPostId, setClickPostId] = useState(-1)

  const keywords = useRef('')
  const ref = useRef(null)

  const { drop } = useAliveController()

  const fetchSearchResults = () => {
    Api.get('/post/search', {
      params: {
        keywords: keywords.current,
        lastId: lastPostId,
        pageSize: 50
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          if (res.data.data.length === 0) {
            setLastPostId(null)
            return
          }
          setPosts((prev) => [...prev, ...res.data.data])
          setLastPostId(res.data.data.at(-1).id)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  const handleSearch = () => {
    setPosts([])
    if (searchInput !== '') {
      keywords.current = searchInput
      fetchSearchResults()
    }
  }

  /* 当输入框处于focus状态时按下enter键执行搜索 */
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSearch()
    }
  }

  const handleOnScrollToBottom = () => {
    if (lastPostId !== null) {
      fetchSearchResults()
    }
  }

  useActivate(() => {
    if (clickPostId !== -1) {
      Api.get('/post/get-one-post', {
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
      setClickPostId(-1)
    }
  })

  const handleExit = () => {
    drop('search-posts')
    history.back()
  }

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="mx-8 my-4 flex justify-between items-center">
        <IconButton size="small" onClick={handleExit}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={handleKeyUp}
          endAdornment={
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      {posts.length === 0 ? (
        <div className="w-full mt-4 text-center">未搜索到任何匹配的结果</div>
      ) : (
        <InfiniteScroll onScrollToBottom={handleOnScrollToBottom} ref={ref}>
          <ResponsiveMasonry
            style={{ padding: `10px 50px` }}
            columnsCountBreakPoints={{ 1200: 3, 800: 2, 400: 1 }}
          >
            <Masonry gutter="10px">
              {posts.map((post, index) => (
                <PostCard
                  key={index}
                  postId={post.id}
                  authorId={post.authorId}
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
      )}
    </div>
  )
}

export default SearchPosts
