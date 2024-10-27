import axios from 'axios'
import axiosRetry from 'axios-retry'
import socket from '../socketio'
import { AXIOS_DEV_URL, AXIOS_PROD_URL } from '../constants/url'

const Api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? AXIOS_DEV_URL : AXIOS_PROD_URL,

  timeout: 5000
})

axiosRetry(Api, { retries: 3 })

Api.interceptors.request.use((config) => {
  config.headers['Authorization'] = sessionStorage.getItem('token')
  /* console.log(config) */
  return config
})

Api.interceptors.response.use(async (res) => {
  console.log(res)
  if (res.data.code === 1002) {
    alert(res.data.message)
    sessionStorage.removeItem('token')
    socket.disconnect()
    await window.api.setLoginWindow()
    window.location.hash = 'login'
  } else {
    return res
  }
})

export default Api
