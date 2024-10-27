import { useEffect, useRef, useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import InfiniteScroll from '../../../components/InfiniteScroll'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import PostCard from '../../../components/PostCard'
import dateFormat from '../../../utils/dateFormat'
import PropTypes from 'prop-types'
import { useActivate } from 'react-activation'

function UserPostList({ userId }) {
  const [posts, setPosts] = useState([])
  const [lastPostId, setLastPostId] = useState(null)
  const [clickPostId, setClickPostId] = useState(-1)

  const ref = useRef(null)

  const fetchPosts = () => {
    Api.get('/post/posts', {
      params: {
        authorId: userId,
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

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleOnScrollToBottom = () => {
    if (lastPostId != null) {
      fetchPosts()
    }
  }

  useActivate(async () => {
    if (clickPostId !== -1) {
      let res = await Api.get('/post/post-detail', {
        params: {
          postId: clickPostId
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
      setPosts(posts.map((post) => (post.id === clickPostId ? res.data.data : post)))
      setClickPostId(-1)
    }
  })

  return posts.length === 0 ? (
    <div className="w-full mt-4 text-center">TA还没有发布任何帖子</div>
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
    </InfiniteScroll>
  )
}

UserPostList.propTypes = {
  userId: PropTypes.number
}

export default UserPostList
