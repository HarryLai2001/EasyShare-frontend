import { ipcRenderer } from 'electron'

window.api = {
    setHomeWindow: () => ipcRenderer.send('home-window-resize'),
    setLoginWindow: () => ipcRenderer.send('login-window-resize')
}