import { Button, IconButton, InputAdornment, Link, FormControl } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Checkbox, FilledInput, FormControlLabel } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import Api from '../api'
import sleep from '../utils/sleep'
import { useDispatch } from 'react-redux'
import { fetchMyInfo } from '../store/modules/myInfoStore'
import { flushSync } from 'react-dom'
import socket from '../socketio'
import { setConnectState } from '../store/modules/socketStateStore'

function Login() {
  const [username, setUsername] = useState(localStorage.getItem('username') ?? '')
  const [password, setPassword] = useState(localStorage.getItem('password') ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(true)
  const [rememberMe, setRememberMe] = useState(true)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    setIsBtnDisabled(username === '' || password === '' || isSubmitting)
  }, [username, password, isSubmitting])

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const handleSubmit = async () => {
    flushSync(() => setIsSubmitting(true))
    if (rememberMe) {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
    } else {
      localStorage.removeItem('username')
      localStorage.removeItem('password')
    }

    await Api.post('/user/login', {
      username: username,
      password: password
    })
      .then(async (res) => {
        if (res.data.code === 1000) {
          sessionStorage.setItem('token', res.data.data)
          toast.success('登陆成功，正在跳转...')
          await sleep(1000)
          window.api.setHomeWindow()
          navigate('/dashboard')
          socket.io.opts.query = {
            token: res.data.data
          }
          socket.connect()
        } else {
          toast.error(res.data.message)
        }
      })
      .then(() => {
        dispatch(fetchMyInfo())
        dispatch(setConnectState(true))
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="w-[300px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <span className="my-4 font-logo text-6xl text-blue-900">易享</span>
      <span className="my-4 text-xl font-title">用户登录</span>
      <FormControl style={{ width: `250px`, margin: `16px 0` }}>
        <FilledInput
          style={{ height: `36px` }}
          fullWidth={true}
          placeholder="请输入用户名"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          type={'text'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl style={{ width: `250px`, margin: `16px 0` }}>
        <FilledInput
          style={{ height: `36px` }}
          fullWidth={true}
          placeholder="请输入密码"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} size="small">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControlLabel
        style={{ alignSelf: `end` }}
        control={
          <Checkbox
            color="default"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            disableRipple
          />
        }
        label="记住我"
      />

      <Button
        variant="outlined"
        color="primary"
        disabled={isBtnDisabled}
        style={{
          width: `150px`,
          margin: `20px 0`
        }}
        onClick={handleSubmit}
      >
        {isSubmitting ? '登录中...' : '登录'}
      </Button>
      <div className="my-4">
        <Link style={{ cursor: `pointer` }} onClick={() => navigate('/signup')}>
          新用户注册
        </Link>
        <Link style={{ margin: `0 20px`, cursor: `pointer` }}>忘记密码</Link>
      </div>
    </div>
  )
}

export default Login
