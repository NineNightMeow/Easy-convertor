import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname, basename, extname } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

// 获取FFmpeg路径
function getFfmpegPath() {
  const fileName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  return app.isPackaged
    ? join(process.resourcesPath, fileName)
    : join(__dirname, '../../resources', fileName)
}

const FFMPEG_PATH = getFfmpegPath()
ffmpeg.setFfmpegPath(FFMPEG_PATH)

// 创建窗口函数createWindow
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false, 
    transparent: true, 
    autoHideMenuBar: true,
    icon: join(__dirname, '../../src/renderer/src/icon/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

//应用生命周期和IPC通信逻辑喵
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.easy.converter')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

  // 窗口控制
  ipcMain.on('window-min', () => BrowserWindow.getFocusedWindow()?.minimize())
  ipcMain.on('window-max', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })
  ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close())

  //对话框
  ipcMain.handle('dialog:select-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return canceled ? null : filePaths[0]
  })

  ipcMain.on('shell:show-item', (_, path) => shell.showItemInFolder(path))

  // 转换任务
  ipcMain.on('task-start', (event, { id, filePath, config, type }) => {
    try {
      const baseOutputDir = config?.outputDir || join(app.getPath('documents'), 'EasyConverter', 'output')
      const typeDir = join(baseOutputDir, type || 'misc')
      ensureDir(typeDir)

      const fileName = basename(filePath, extname(filePath))
      const outExt = config?.format || 'mp4'
      const outputPath = join(typeDir, `${fileName}_converted.${outExt}`)

      console.log(`[Task ${id}] Type: ${type} | ${filePath} -> ${outputPath}`)

      let cmd = ffmpeg(filePath)

      //视频
      if (type === 'video' && config) {
        if (config.resolution && config.resolution !== 'original') cmd.size(config.resolution)
        if (config.aspectRatio) cmd.aspect(config.aspectRatio)
        
        if (config.quality) {
          const crf = Math.floor(51 - (config.quality / 100 * 51))
          cmd.outputOptions(['-crf', crf])
        }
        if (config.fps) cmd.fps(parseInt(config.fps))
        if (config.audioBitrate) cmd.audioBitrate(config.audioBitrate)
        if (config.trimStart) cmd.setStartTime(config.trimStart)
        if (config.trimEnd) cmd.setDuration(config.trimEnd)
        if (config.mute) cmd.noAudio()
      }

      //音频
      if (type === 'audio' && config) {
        cmd.noVideo()
        if (config.audioBitrate) cmd.audioBitrate(config.audioBitrate)
        if (config.channels) cmd.audioChannels(parseInt(config.channels))
        if (config.trimStart) cmd.setStartTime(config.trimStart)
        if (config.trimEnd) cmd.setDuration(config.trimEnd)
      }

      //图像加载逻辑
      if (type === 'image' && config) {
        if (outExt === 'ico') {
          const w = config.width ? parseInt(config.width) : 0
          if (w === 0 || w > 256) {
            cmd.size('256x?') 
          } else {
            cmd.size(`${w}x?`)
          }
        } else {
          if (config.width) cmd.size(`${config.width}x?`)
        }
      }

      cmd
        .toFormat(outExt)
        .on('progress', (p) => {
          const percent = p.percent ? Math.round(p.percent) : 0
          event.sender.send('task-progress', { id, progress: percent })
        })
        .on('end', () => event.sender.send('task-complete', { id, path: outputPath }))
        .on('error', (err) => {
          console.error('FFmpeg Error:', err)
          event.sender.send('task-error', { id, msg: err.message })
        })
        .save(outputPath)

    } catch (error) {
      console.error('Task Start Error:', error)
      event.sender.send('task-error', { id, msg: error.message })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})