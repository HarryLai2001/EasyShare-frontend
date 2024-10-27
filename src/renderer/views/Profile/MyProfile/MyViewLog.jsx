import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import PostCard from '../../../components/PostCard'
import dateFormat from '../../../utils/dateFormat'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Api from '../../../api'
import { useActivate } from 'react-activation'

function MyViewLog() {
  const [posts, setPosts] = useState([])
  const [clickPostId, setClickPostId] = useState(-1)

  const fetchPosts = () => {
    Api.get('/view/recent-view-log', {
      params: {
        dayLimit: 7,
        pageSize: 200
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
      .then((res) => {
        if (res.data.code === 1000) {
          setPosts([...posts, ...res.data.data])
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }

  useEffect(() => {
    fetchPosts()
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

  return posts.length === 0 ? (
    <div className="w-full mt-4 text-center">你还没有任何浏览记录</div>
  ) : (
    <div className="w-full flex-auto overflow-y-auto">
      <ResponsiveMasonry
        style={{ padding: `20px 50px` }}
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
              lastUpdate={dateFormat(post.lastUpdate)}
              viewsCnt={post.viewsCnt}
              isLiked={post.isLiked}
              likesCnt={post.likesCnt}
              commentsCnt={post.commentsCnt}
              onClick={(postId) => setClickPostId(postId)}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export default MyViewLog
