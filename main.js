const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 无边框
        backgroundColor: '#09090b',
        webPreferences: {
            // 【关键点1】使用 path.join 确保打包后也能找到 preload.js
            // __dirname 在打包环境(asar)中也能正确解析
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
    
    // 开发环境下打开控制台 (调试用，发布时可以注释掉)
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    // Mac OS 重新激活窗口逻辑
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ---------------------------------------------------------
// 【关键点2】把监听逻辑放在最外层，并使用 getFocusedWindow
// 这种写法最稳健，打包后不容易失效
// ---------------------------------------------------------

ipcMain.on('window-min', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
});

ipcMain.on('window-max', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
});

ipcMain.on('window-close', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.close();
});

ipcMain.on('window-top', (event, isTop) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.setAlwaysOnTop(isTop);
});