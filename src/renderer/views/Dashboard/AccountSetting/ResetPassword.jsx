import { FilledInput, FormHelperText } from '@mui/material'
import {
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  Typography
} from '@material-ui/core'
import LockIcon from '@mui/icons-material/Lock'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Api from '../../../api'
import sleep from '../../../utils/sleep'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

function ResetPassword() {
  const [oldPassword, setOldPassword] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [newPassword, setNewPassword] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [newPassword2, setNewPassword2] = useState({
    value: '',
    isValid: false,
    isDefaultValue: true
  })
  const [isBtnDisabled, setIsBtnDisabled] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleOldPasswordChange = (e) => {
    setOldPassword({
      value: e.target.value,
      isValid: e.target.value !== '',
      isDefaultValue: false
    })
  }

  const handleNewPasswordChange = (e) => {
    const reg = /^\S*(?=\S{8,16})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/
    setNewPassword({
      value: e.target.value,
      isValid: reg.test(e.target.value),
      isDefaultValue: false
    })
  }

  const handleNewPassword2Change = (e) => {
    setNewPassword2({
      value: e.target.value,
      isValid: e.target.value === newPassword.value,
      isDefaultValue: false
    })
  }

  useEffect(() => {
    setNewPassword2({
      ...newPassword2,
      isValid: newPassword.value === newPassword2.value
    })
  }, [newPassword])

  useEffect(() => {
    setIsBtnDisabled(
      !oldPassword.isValid || !newPassword.isValid || !newPassword2.isValid || isSubmitted
    )
  }, [oldPassword, newPassword, newPassword2, isSubmitted])

  const navigate = useNavigate()

  const handleSubmit = () => {
    setIsSubmitted(true)
    if (oldPassword.value === newPassword.value) {
      toast.error('新密码不能与原始密码相同')
      return
    }
    Api.put('/user/reset-password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
      .then(async (res) => {
        if (res.data.code === 1000) {
          toast.success('重置密码成功，正在跳转到登录页...')
          await sleep(3000)
          await window.api.setLoginWindow()
          navigate('/login')
        } else {
          toast.error(res.data.message)
        }
      })
      .finally(() => setIsSubmitted(false))
  }

  return (
    <div className="w-full px-8 my-4">
      <div className="w-full mb-6 flex justify-between">
        <IconButton size="small" onClick={() => history.back()}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        /
      </div>
      <Card style={{ margin: `20px 40px` }}>
        <CardContent
          style={{
            padding: `20px 40px`,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `self-start`
          }}
        >
          <Typography style={{ fontSize: `20px`, color: `#2c3e50` }}>重置密码</Typography>
          <div className="w-full py-4 flex flex-col items-center">
            <FormControl style={{ width: `320px`, margin: `10px 20px` }}>
              <FilledInput
                style={{
                  width: `300px`,
                  height: `36px`
                }}
                type="password"
                placeholder="请输入原始密码"
                disableUnderline={true}
                hiddenLabel={true}
                margin="dense"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                value={oldPassword.value}
                onChange={handleOldPasswordChange}
              />
              <FormHelperText error={true} style={{ height: `16px` }}>
                {oldPassword.isDefaultValue || oldPassword.isValid ? '' : '原始密码不能为空'}
              </FormHelperText>
            </FormControl>
            <FormControl style={{ width: `320px`, margin: `10px 20px` }}>
              <FilledInput
                style={{
                  width: `300px`,
                  height: `36px`
                }}
                type="password"
                placeholder="请输入新密码"
                disableUnderline={true}
                hiddenLabel={true}
                margin="dense"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                value={newPassword.value}
                onChange={handleNewPasswordChange}
              />
              <FormHelperText error={true} style={{ height: `16px` }}>
                {newPassword.isDefaultValue || newPassword.isValid
                  ? ''
                  : '密码长度为8到16个字符，必须包含大写、小写字母和数字'}
              </FormHelperText>
            </FormControl>
            <FormControl style={{ width: `320px`, margin: `10px 20px` }}>
              <FilledInput
                style={{
                  width: `300px`,
                  height: `36px`
                }}
                type="password"
                placeholder="请再次输入新密码"
                disableUnderline={true}
                hiddenLabel={true}
                margin="dense"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                value={newPassword2.value}
                onChange={handleNewPassword2Change}
              />
              <FormHelperText error={true} style={{ height: `16px` }}>
                {newPassword2.isDefaultValue || newPassword2.isValid
                  ? ''
                  : '两次输入的新密码不一致'}
              </FormHelperText>
            </FormControl>
            <Button
              variant="outlined"
              color="primary"
              style={{
                width: `150px`,
                marginTop: `20px`,
                alignSelf: `center`
              }}
              disabled={isBtnDisabled}
              onClick={handleSubmit}
            >
              {isSubmitted ? '重置密码中...' : '重置密码'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
