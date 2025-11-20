// 【新增】这行代码用于屏蔽开发环境的安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    icon: path.join(__dirname, 'icon.png'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // 允许加载本地图片，这是必须的
    },
    backgroundColor: '#09090b',
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');

  // 开启调试工具 (如果您想看控制台，可以保留；如果软件正常了，可以注释掉下面这行)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});