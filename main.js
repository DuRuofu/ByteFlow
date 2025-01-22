const { app, BrowserWindow ,ipcMain} = require('electron/main')
const path = require('node:path')
const fs = require('fs')

const writeFile = (event, data) => {
  console.log('保存文件')

  // 保存文件
  fs.writeFileSync('D:/data.txt', data)
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('save-file',writeFile)

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
