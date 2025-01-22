const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const fs = require('fs')

console.log('得得得得的')

const writeFile = (event, data) => {
  console.log('保存文件')

  // 保存文件
  fs.writeFileSync('D:/data.txt', data)
}

const readFile = () => {

  // 读取文件
  const res = fs.readFileSync('D:/data.txt', 'utf-8').toString()
  console.log('读取文件:', res)
  // 返回数据
  return res
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 设置图标
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('save-file', writeFile)
  ipcMain.handle('read-file', readFile)

  win.loadFile('./pages/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
