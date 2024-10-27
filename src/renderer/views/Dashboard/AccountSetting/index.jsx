import { useEffect, useState } from 'react'
import Api from '../../../api'
import dateFormat from '../../../utils/dateFormat'
import toast from 'react-hot-toast'
import { Button, Card, CardContent, Typography } from '@material-ui/core'
import LockIcon from '@mui/icons-material/Lock'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import { useNavigate } from 'react-router-dom'

function AccountSetting() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState('')

  useEffect(() => {
    Api.get('/user/user-info')
      .then((res) => {
        if (res.data.code === 1000) {
          setUsername(res.data.data.username)
          setEmail(res.data.data.email)
          setCreatedAt(dateFormat(res.data.data.createdAt))
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => {
        toast.error('请求失败，请重试')
      })
  }, [])

  const navigate = useNavigate()

  return (
    <div className="w-full h-[100vh] pt-8 px-16 overflow-auto">
      <Card style={{ margin: `10px 10px` }}>
        <CardContent style={{ padding: `20px 40px` }}>
          <Typography style={{ fontSize: `20px` }}>账号信息</Typography>
          <Typography>
            <table className="table-auto ml-16 mt-4">
              <tr>
                <td className="py-2 pr-20 text-gray-400">用户名</td>
                <td className="py-2">{username}</td>
              </tr>
              <tr>
                <td className="py-2 pr-20 text-gray-400">邮箱</td>
                <td className="py-2">{email}</td>
              </tr>
              <tr>
                <td className="py-2 pr-20 text-gray-400">注册时间</td>
                <td className="py-2">{createdAt}</td>
              </tr>
            </table>
          </Typography>
        </CardContent>
      </Card>
      <div className="w-full pl-4 mt-8 text-xl font-regular">设置</div>
      <div className="w-full px-2 my-4 flex flex-col">
        <Button
          style={{
            width: `100%`,
            padding: `15px 40px`,
            margin: `5px 0`,
            textAlign: 'left',
            display: `block`,
            border: `2px solid #ecf0f1`,
            background: `#ffffff`
          }}
          onClick={() => navigate('/dashboard/account-setting/reset-password')}
        >
          <LockIcon />
          <span className="ml-6">重置密码</span>
        </Button>
        <Button
          style={{
            width: `100%`,
            padding: `15px 40px`,
            margin: `5px 0`,
            textAlign: 'left',
            display: `block`,
            border: `2px solid #ecf0f1`,
            background: `#ffffff`
          }}
        >
          <AlternateEmailIcon />
          <span className="ml-6">更换邮箱</span>
        </Button>
        <Button
          style={{ marginTop: `20px` }}
          variant="contained"
          color="secondary"
          onClick={() => navigate('/dashboard/account-setting/delete-account')}
        >
          注销账号
        </Button>
      </div>
    </div>
  )
}

export default AccountSetting
