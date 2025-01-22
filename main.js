const { app, BrowserWindow, ipcMain,Menu  } = require('electron/main')
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

  //定义菜单
  const mainMenu = Menu.buildFromTemplate(  menuTemplate  );
  //设置菜单，才展示出来
  Menu.setApplicationMenu( mainMenu );
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

//定义菜单
const menuTemplate = [
    {
        label:'文件',
        submenu:[
            {
                label:'新增一条记录',
                click:()=>{
                    createAddWindow();
                }
            },
            {
                label:'退出程序',
                accelerator:process.platform=='darwin'?'Command + W' : 'ctrl + W',
                click:()=>{
                    app.quit();
                }
            }
        ]
    },
    {
        label:'开发者工具',
        submenu:[
            {
                label:'打开/关闭',
                //设定快捷键
                accelerator:process.platform=='darwin'?'Command + I' : 'ctrl + I',
                //菜单事件
                click:( item , focusedWindow )=>{
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label:'刷新页面',
                role:'reload',
                accelerator:process.platform=='darwin'?'Command + T' : 'ctrl + T',
            }
        ]
    }
];

const createAddWindow = ()=>{
    
    const wins = new BrowserWindow({
        width: 800,
        height: 600
    })
    
    wins.loadFile('./pages/add.html');

}
