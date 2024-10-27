import { createSlice } from '@reduxjs/toolkit'
import Api from '../../api'

const myInfoStore = createSlice({
  name: 'myInfo',
  initialState: {
    myUserId: 0,
    myUsername: ''
  },
  reducers: {
    setMyInfo(state, action) {
      state.myUserId = action.payload.id
      state.myUsername = action.payload.username
    }
  }
})

const { setMyInfo } = myInfoStore.actions
const fetchMyInfo = () => {
  return async (dispatch) => {
    const res = await Api.get('/user/user-info')
    dispatch(setMyInfo(res.data.data))
  }
}

export { fetchMyInfo }

export default myInfoStore.reducer

