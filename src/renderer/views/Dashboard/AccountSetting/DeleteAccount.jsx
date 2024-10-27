import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../../api'
import toast from 'react-hot-toast'
import sleep from '../../../utils/sleep'
import {
  Card,
  CardContent,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { Button } from '@material-ui/core'

function DeleteAccount() {
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
  const [isBtnDisabled, setIsBtnDisabled] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handlePasswordChange = (e) => {
    setPassword({
      value: e.target.value,
      isValid: e.target.value != '',
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
    setPassword2({
      ...password2,
      isValid: password.value === password2.value
    })
  }, [password])

  useEffect(() => {
    setIsBtnDisabled(!password.isValid || !password2.isValid || isSubmitted)
  }, [password, password2, isSubmitted])

  const navigate = useNavigate()

  const handleSubmit = () => {
    if (window.confirm('你确定要注销账号吗？')) {
      setIsSubmitted(true)
      Api.delete('/user/delete', {
        params: {
          password: password.value
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })
        .then(async (res) => {
          if (res.data.code === 1000) {
            toast.success('注销账户成功')
            await sleep(3000)
            await window.api.setLoginWindow()
            navigate('/login')
          } else {
            toast.error(res.data.message)
          }
        })
        .finally(() => setIsSubmitted(false))
    }
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
          <Typography style={{ fontSize: `20px`, color: `#2c3e50` }}>注销账号</Typography>
          <div className="w-full py-4 flex flex-col items-center">
            <FormControl style={{ width: `320px`, margin: `10px 20px` }}>
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
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                value={password.value}
                onChange={handlePasswordChange}
              />
              <FormHelperText error={true} style={{ height: `16px` }}>
                {password.isDefaultValue || password.isValid
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
                placeholder="请再次输入密码"
                disableUnderline={true}
                hiddenLabel={true}
                margin="dense"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                value={password2.value}
                onChange={handlePassword2Change}
              />
              <FormHelperText error={true} style={{ height: `16px` }}>
                {password2.isDefaultValue || password2.isValid ? '' : '两次输入的密码不一致'}
              </FormHelperText>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              style={{
                width: `150px`,
                marginTop: `20px`,
                alignSelf: `center`
              }}
              disabled={isBtnDisabled}
              onClick={handleSubmit}
            >
              {isSubmitted ? '账号注销中...' : '注销账号'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeleteAccount
