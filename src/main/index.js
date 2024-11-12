/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 500,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        icon: join(__dirname, '../../resources/logo/planet.ico'),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            nodeIntegration: true, // 设置为true可调用nodejs的api
            webSecurity: false, // 禁用同源策略
            sandbox: false,
            contextIsolation: false // 禁用上下文隔离，可以调用remote模块
        }
    })

    app.setName('易享') // 设置应用名
    app.setAppUserModelId('易享') // 修改默认通知应用名

    // 渲染进程完成后触发ready-to-show事件显示窗口，显示窗口将没有视觉闪烁
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        globalShortcut.register('f5', () => mainWindow.reload()) // 注册f5刷新快捷键
    })

    // 在创建的窗口中打开window.open()传入的 resolved 的URL
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    /* 开发环境下运行ELECTRON_RENDERER_URL，生产环境下运行dist目录中打包好的静态html */
    const winUrl = is.dev && process.env['ELECTRON_RENDERER_URL'] ? process.env['ELECTRON_RENDERER_URL'] : join(__dirname, '../renderer/index.html')
    mainWindow.loadURL(winUrl)

    ipcMain.on('home-window-resize', () => {
        mainWindow.setOpacity(0)
        mainWindow.setSize(1024, 768)
        mainWindow.center()
        mainWindow.minimize()
        setTimeout(() => {
            mainWindow.setOpacity(1)
            mainWindow.show()
            mainWindow.focus()
        }, 1000)
    })

    ipcMain.on('login-window-resize', () => {
        mainWindow.setOpacity(0)
        mainWindow.setSize(500, 600)
        mainWindow.center()
        mainWindow.minimize()
        setTimeout(() => {
            mainWindow.setOpacity(1)
            mainWindow.show()
            mainWindow.focus()
        }, 1000)
    })

    mainWindow.on('close', () => {
        mainWindow.webContents.un
    })
}

app.whenReady().then(() => {
    // 用于在Windows操作系统中设置应用程序的用户模型标识符，确保应用的唯一性和功能正确性
    electronApp.setAppUserModelId('com.easyshare')

    // 监视快捷键，如F12在开发模式下打开devTool，不需要手动写代码开启
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // 创建窗口
    createWindow()

    app.on('activate', () => {
        // 点击图标时若当前无窗口则创建窗口（仅对mac有效）
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

//当全部窗口关闭时退出程序（windows和linux）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})