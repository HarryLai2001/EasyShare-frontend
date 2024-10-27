import { Provider } from 'react-redux'
import App from './App'
import './main.css'
import ReactDOM from 'react-dom/client'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/lib/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
