import { contextBridge, ipcRenderer, webUtils } from 'electron'

console.log('✅ Preload script loaded')

const api = {
  // 1. 核心转换
  convert: (data) => ipcRenderer.send('task-start', data),
  
  // 2. 获取文件真实路径
  getFilePath: (file) => webUtils.getPathForFile(file),

  // 3. 事件监听
  onProgress: (callback) => {
    const subscription = (_event, value) => callback(value)
    ipcRenderer.on('task-progress', subscription)
    return () => ipcRenderer.removeListener('task-progress', subscription)
  },
  onComplete: (callback) => {
    const subscription = (_event, value) => callback(value)
    ipcRenderer.on('task-complete', subscription)
    return () => ipcRenderer.removeListener('task-complete', subscription)
  },
  onError: (callback) => {
    const subscription = (_event, value) => callback(value)
    ipcRenderer.on('task-error', subscription)
    return () => ipcRenderer.removeListener('task-error', subscription)
  },
  
  removeAll: () => {
    ipcRenderer.removeAllListeners('task-progress')
    ipcRenderer.removeAllListeners('task-complete')
    ipcRenderer.removeAllListeners('task-error')
  },

  // 4. 系统功能
  selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
  showItemInFolder: (path) => ipcRenderer.send('shell:show-item', path), 

  // 5. 窗口控制 (新增)
  minimize: () => ipcRenderer.send('window-min'),
  maximize: () => ipcRenderer.send('window-max'),
  close: () => ipcRenderer.send('window-close')
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error('Failed to expose api:', error)
}