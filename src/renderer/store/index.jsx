import { persistReducer } from 'redux-persist'
import myInfoReducer from './modules/myInfoStore'
import { applyMiddleware, combineReducers, configureStore } from '@reduxjs/toolkit'
import persistStore from 'redux-persist/es/persistStore'
import socketStateReducer from './modules/socketStateStore'
import sessionStorage from 'redux-persist/es/storage/session'
import chatMessageReducer from './modules/chatMessageStore'
import systemMessageCountReducer from './modules/systemMessageCountStore'
import { thunk } from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage: sessionStorage
}

const rootReducer = combineReducers({
  myInfo: myInfoReducer,
  socketState: socketStateReducer,
  systemMessageCount: systemMessageCountReducer,
  chatMessage: chatMessageReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export const persistor = persistStore(store)
