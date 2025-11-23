const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window-min'),
    maximize: () => ipcRenderer.send('window-max'),
    close: () => ipcRenderer.send('window-close'),
    forceClose: () => ipcRenderer.send('window-force-close'), // 新增
    setAlwaysOnTop: (isTop) => ipcRenderer.send('window-top', isTop),
    showItemInFolder: (filePath) => ipcRenderer.send('show-item-in-folder', filePath),
    // 新增：监听关闭请求
    onCloseRequest: (callback) => {
        // 这里的 callback 会被多次注册，最好在 React useEffect 里清理
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on('app-close-request', subscription);
        // 返回一个清理函数
        return () => ipcRenderer.removeListener('app-close-request', subscription);
    }
});