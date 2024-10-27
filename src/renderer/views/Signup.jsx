import { Button, FormControl, InputAdornment, Link } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FilledInput, FormHelperText } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LockIcon from '@mui/icons-material/Lock'
import Api from '../api'
import sleep from '../utils/sleep'
import { flushSync } from 'react-dom'

function Signup() {
  const [username, setUsername] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [email, setEmail] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [password, setPassword] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [password2, setPassword2] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(true)

  useEffect(() => {
    setIsBtnDisabled(
      !username.isValid || !email.isValid || !password.isValid || !password2.isValid || isSubmitting
    )
  }, [username, email, password, password2, isSubmitting])

  const handleUsernameChange = (e) => {
    // 用户名校验，6到16位，只允许字母，数字，下划线，减号
    const reg = /^[a-zA-Z0-9_-]{6,16}$/
    setUsername({
      value: e.target.value,
      isValid: reg.test(e.target.value),
      isDefaultValue: false
    })
  }

  const handleEmailChange = (e) => {
    // 邮箱校验，只允许英文字母、数字、下划线、英文句号、以及中划线组成
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/
    setEmail({
      value: e.target.value,
      isValid: reg.test(e.target.value),
      isDefaultValue: false
    })
  }

  const handlePasswordChange = (e) => {
    // 密码校验，8到16位，包括至少1个大写字母，1个小写字母，1个数字
    const reg = /^\S*(?=\S{8,16})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/
    setPassword({
      value: e.target.value,
      isValid: reg.test(e.target.value),
      isDefaultValue: false
    })
  }

  const handlePassword2Change = (e) => {
    setPassword2({
      value: e.target.value,
      isValid: e.target.value === password.value,
      isDefaultValue: false
    })
  }

  useEffect(() => {
    if (!password2.isDefaultValue) {
      setPassword2({
        ...password2,
        isValid: password2.value === password.value
      })
    }
  }, [password])

  const navigate = useNavigate()

  const handleSubmit = () => {
    flushSync(() => setIsSubmitting(true))
    Api.post('/user/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    })
      .then(async (res) => {
        if (res.data.code === 1000) {
          toast.success(res.data.message)
          await sleep(1000)
          navigate('/login')
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="w-[500px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <span className="my-2 text-2xl font-regular">
        欢迎使用<span className="mx-2 font-logo text-4xl text-blue-900">易享</span>
      </span>
      <span className="my-4 text-xl font-title">新用户注册</span>
      <FormControl style={{ width: `300px`, marginBottom: `10px` }}>
        <FilledInput
          style={{
            width: `300px`,
            height: `36px`
          }}
          placeholder="请输入用户名"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          value={username.value}
          onChange={handleUsernameChange}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
        />
        <FormHelperText error={true} style={{ height: `16px` }}>
          {username.isDefaultValue || username.isValid
            ? ''
            : '用户名长度为8到16个字符，只能由字母、数字和下划线组成'}
        </FormHelperText>
      </FormControl>
      <FormControl style={{ width: `300px`, marginBottom: `10px` }}>
        <FilledInput
          style={{
            width: `300px`,
            height: `36px`
          }}
          placeholder="请输入电子邮箱"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          value={email.value}
          onChange={handleEmailChange}
          startAdornment={
            <InputAdornment position="start">
              <AlternateEmailIcon />
            </InputAdornment>
          }
        />
        <FormHelperText error={true} style={{ height: `16px` }}>
          {email.isDefaultValue || email.isValid ? '' : '邮箱格式不正确'}
        </FormHelperText>
      </FormControl>
      <FormControl style={{ width: `300px`, marginBottom: `10px` }}>
        <FilledInput
          style={{
            width: `300px`,
            height: `36px`
          }}
          type="password"
          placeholder="请输入密码"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          value={password.value}
          onChange={handlePasswordChange}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
        />
        <FormHelperText error={true} style={{ height: `16px` }}>
          {password.isDefaultValue || password.isValid
            ? ''
            : '密码长度为8到16个字符，必须包含大写、小写字母和数字'}
        </FormHelperText>
      </FormControl>
      <FormControl style={{ width: `300px`, marginBottom: `10px` }}>
        <FilledInput
          style={{
            width: `300px`,
            height: `36px`
          }}
          type="password"
          placeholder="请再次输入密码"
          disableUnderline={true}
          hiddenLabel={true}
          margin="dense"
          value={password2.value}
          onChange={handlePassword2Change}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
        />
        <FormHelperText error={true} style={{ height: `16px` }}>
          {password2.isDefaultValue || password2.isValid ? '' : '两次输入的密码不一致'}
        </FormHelperText>
      </FormControl>

      <Button
        variant="outlined"
        color="primary"
        style={{
          width: `150px`,
          height: `30px`,
          margin: `10px 0`
        }}
        disabled={isBtnDisabled}
        onClick={handleSubmit}
      >
        {isSubmitting ? '注册中...' : '注册'}
      </Button>
      <div className="my-2">
        已有账号？
        <Link style={{ cursor: `pointer` }} onClick={() => navigate('/login')}>
          去登陆
        </Link>
      </div>
    </div>
  )
}

export default Signup
