import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import KeepAlive from 'react-activation'
import Loading from '../views/loading'

import Login from '../views/Login'
import Signup from '../views/Signup'
import Dashboard from '../views/Dashboard'
const CreatePost = lazy(() => import('../views/Dashboard/Discover/CreatePost'))
const Discover = lazy(() => import('../views/Dashboard/Discover'))
const SearchPosts = lazy(() => import('../views/Dashboard/Discover/SearchPosts'))
const PostDetail = lazy(() => import('../views/PostDetail'))
const Profile = lazy(() => import('../views/Profile'))
const Message = lazy(() => import('../views/Dashboard/Message'))
const LikeMessageList = lazy(() => import('../views/LikeMessageList'))
const FollowMessageList = lazy(() => import('../views/FollowMessageList'))
const CommentMessageList = lazy(() => import('../views/CommentMessageList'))
const PrivateChat = lazy(() => import('../views/PrivateChat'))
const MyProfile = lazy(() => import('../views/Profile/MyProfile'))
const AccountSetting = lazy(() => import('../views/Dashboard/AccountSetting'))
const ResetPassword = lazy(() => import('../views/Dashboard/AccountSetting/ResetPassword'))
const DeleteAccount = lazy(() => import('../views/Dashboard/AccountSetting/DeleteAccount'))

function BaseRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<Loading />}>
            <Signup />
          </Suspense>
        }
      />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to="/dashboard/discover" />} />
        <Route
          path="discover"
          element={
            // keepalive需放在suspense外面，否则初次加载时会白屏无法渲染
            <KeepAlive id="disover" name="disover" cacheKey="discover">
              <Suspense fallback={<Loading />}>
                <Discover />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="discover/create-post"
          element={
            <Suspense fallback={<Loading />}>
              <CreatePost />
            </Suspense>
          }
        />
        <Route
          path="discover/search-posts"
          element={
            <KeepAlive id="search-posts" name="search-posts" cacheKey="search-posts" autoFreeze>
              <Suspense fallback={<Loading />}>
                <SearchPosts />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="message"
          element={
            <KeepAlive id="message" name="message" cacheKey="message">
              <Suspense fallback={<Loading />}>
                <Message />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="my-profile"
          element={
            <KeepAlive id="my-profile" name="my-profile" cacheKey="my-profile">
              <Suspense fallback={<Loading />}>
                <MyProfile />
              </Suspense>
            </KeepAlive>
          }
        />
        <Route
          path="account-setting"
          element={
            <Suspense fallback={<Loading />}>
              <AccountSetting />
            </Suspense>
          }
        />
        <Route
          path="account-setting/reset-password"
          element={
            <Suspense fallback={<Loading />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route
          path="account-setting/delete-account"
          element={
            <Suspense fallback={<Loading />}>
              <DeleteAccount />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="post/:postId"
        element={
          <Suspense fallback={<Loading />}>
            <PostDetail />
          </Suspense>
        }
      />
      <Route
        path="user/:userId"
        element={
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        }
      />
      <Route
        path="private-chat/:userId"
        element={
          <Suspense fallback={<Loading />}>
            <PrivateChat />
          </Suspense>
        }
      />
      <Route
        path="message/like-message-list"
        element={
          <KeepAlive id="like-message-list" name="like-message-list" cacheKey="like-message-list">
            <Suspense fallback={<Loading />}>
              <LikeMessageList />
            </Suspense>
          </KeepAlive>
        }
      />
      <Route
        path="message/follow-message-list"
        element={
          <KeepAlive
            id="follow-message-list"
            name="follow-message-list"
            cacheKey="follow-message-list"
          >
            <Suspense fallback={<Loading />}>
              <FollowMessageList />
            </Suspense>
          </KeepAlive>
        }
      />
      <Route
        path="message/comment-message-list"
        element={
          <KeepAlive
            id="comment-message-list"
            name="comment-message-list"
            cacheKey="comment-message-list"
          >
            <Suspense fallback={<Loading />}>
              <CommentMessageList />
            </Suspense>
          </KeepAlive>
        }
      />
    </Routes>
  )
}

export default BaseRouter
