import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null
const childWindow: { [key: string]: BrowserWindow } = {}

async function createMyWindow(partition: string): Promise<void> {
  // 确保使用的是持久化的 partition
  const mySession = session.fromPartition('persist:' + partition)
  const appPath = app.getAppPath()
  let filePath = ''
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    filePath = join(appPath, 'resources/ophjlpahpchlmihnnnihgmmeilfjmjjc/3.2.2_0')
  } else {
    filePath = join(
      appPath,
      '../app.asar.unpacked/resources/ophjlpahpchlmihnnnihgmmeilfjmjjc/3.2.2_0'
    )
  }
  await mySession
    .loadExtension(filePath, {
      allowFileAccess: true
    })
    .then(({ id }) => {
      console.log(111, id)
    })

  const [x, y] = mainWindow!.getPosition()
  childWindow[partition] = new BrowserWindow({
    width: 900,
    x: x + 100,
    y: y + 100,
    height: 670,
    resizable: false,
    parent: mainWindow!,
    frame: false,
    movable: false,
    paintWhenInitiallyHidden: false,
    webPreferences: {
      sandbox: false,
      partition: 'persist:' + partition // 使用持久化的 partition
    }
  })
  const isWindows = process.platform === 'win32'
  let needsFocusFix = false
  let triggeringProgrammaticBlur = false

  childWindow[partition].on('blur', () => {
    if (!triggeringProgrammaticBlur) {
      needsFocusFix = true
    }
  })

  childWindow[partition].on('focus', () => {
    if (isWindows && needsFocusFix) {
      needsFocusFix = false
      triggeringProgrammaticBlur = true
      setTimeout(function () {
        childWindow[partition].blur()
        childWindow[partition].focus()
        setTimeout(function () {
          triggeringProgrammaticBlur = false
        }, 100)
      }, 100)
    }
  })

  childWindow[partition].loadURL('chrome-extension://ophjlpahpchlmihnnnihgmmeilfjmjjc/index.html')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.on('move', () => {
    const [x, y] = mainWindow!.getPosition()
    const childX = x + 100
    const childY = y + 100

    Object.keys(childWindow).forEach((key) => {
      childWindow[key].setPosition(childX, childY)
    })
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

app.on('second-instance', () => {
  // 当运行第二个实例时, 将焦点转移到 mainWindow
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('ping', () => console.log('pong'))
    ipcMain.on('ipcHandleAdd', () => {
      createMyWindow('win1')
    })
    ipcMain.on('ipcHandleAdd1', () => {
      createMyWindow('win2')
    })

    ipcMain.on('CloseWin', (_event, arg) => {
      console.log(arg)
      console.log(childWindow[arg])
      childWindow[arg]?.hide()
    })

    createWindow()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
