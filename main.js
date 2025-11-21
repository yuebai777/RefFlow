const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        frame: false, // 无边框
        backgroundColor: '#09090b',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools(); // 调试时可打开
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('refflow', (request, callback) => {
        const url = request.url.replace('refflow://', '');
        try { return callback(decodeURIComponent(url)); } catch (error) { console.error(error); }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC 监听逻辑 ---

ipcMain.on('window-min', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
});

ipcMain.on('window-max', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    }
});

// 【修复重点】拦截关闭，发送信号给网页
ipcMain.on('window-close', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.webContents.send('app-close-request');
    }
});

// 【新增】强制关闭（当网页确认不保存后调用）
ipcMain.on('window-force-close', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.destroy(); // 使用 destroy 强制关闭，避免再次触发 close 事件循环
});

ipcMain.on('window-top', (event, isTop) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.setAlwaysOnTop(isTop);
});