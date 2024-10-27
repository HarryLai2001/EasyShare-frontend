import { io } from 'socket.io-client'
import { SOCKET_DEV_URL, SOCKET_PROD_URL } from '../constants/url'

const socket = io(process.env.NODE_ENV === 'development' ? SOCKET_DEV_URL : SOCKET_PROD_URL, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true, // 开启断线重连
  reconnectionDelay: 10000, // 断线后间隔10秒重连
  reconnectionAttempts: 10 // 最多尝试10次重连
})

export default socket
