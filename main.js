const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 【关键】去掉系统自带的标题栏和边框
        backgroundColor: '#09090b',
        webPreferences: {
            // 允许网页与Electron通信
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');

    // --- 监听来自网页的指令 ---

    // 最小化
    ipcMain.on('window-min', () => win.minimize());

    // 最大化/还原
    ipcMain.on('window-max', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    // 关闭
    ipcMain.on('window-close', () => win.close());

    // 置顶/取消置顶
    ipcMain.on('window-top', (event, isTop) => {
        win.setAlwaysOnTop(isTop);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});