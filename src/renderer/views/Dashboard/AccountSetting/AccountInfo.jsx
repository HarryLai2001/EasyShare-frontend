import { Card, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Api from '../../../api'
import toast from 'react-hot-toast'
import dateFormat from '../../../utils/dateFormat'

function AccountInfo() {
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

  return (
    <div className="w-full px-12 py-8 flex flex-col">
      <Card style={{ margin: `10px 10px` }}>
        <CardContent style={{ padding: `20px 40px` }}>
          <Typography style={{ fontSize: `20px`, color: `#2c3e50` }}>账号信息</Typography>
          <Typography>
            <table className="table-auto ml-16 mt-4">
              <tr>
                <td className="py-2 pr-20">用户名</td>
                <td className="py-2">{username}</td>
              </tr>
              <tr>
                <td className="py-2 pr-20">邮箱</td>
                <td className="py-2">{email}</td>
              </tr>
              <tr>
                <td className="py-2 pr-20">注册时间</td>
                <td className="py-2">{createdAt}</td>
              </tr>
            </table>
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountInfo
