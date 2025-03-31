/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';
import WebSocket from 'ws';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let ws: WebSocket | null = null;

// Store workspace state
let currentWorkspace: { path: string; isActive: boolean } | null = null;

const API_BASE_URL = 'http://localhost:8080'; 

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Handle folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle workspace activation
ipcMain.handle('activate-workspace', async (_, folderPath) => {
  const watchSelector = {
    shift_title: "string",
    watch_directory: folderPath,
  }
  try {
    // Call the Python API to start watching the folder
    const response = await axios.post(`${API_BASE_URL}/watch/attach`, watchSelector);
    
    if (response.status === 200) {
      currentWorkspace = {
        path: folderPath,
        isActive: true
      };
      
      // Connect to WebSocket after successful activation
      connectWebSocket();
      
      return { success: true, workspace: currentWorkspace };
    }
    return { 
      success: false, 
      error: `API returned status ${response.status}` 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to activate workspace' 
    };
  }
});

// Handle closing the shift
ipcMain.handle('close-shift', async () => {
  try {
    if (!currentWorkspace) {
      return { success: false, error: 'No active workspace' };
    }
    
    // Call the API to stop watching the folder
    const response = await axios.get(`${API_BASE_URL}/watch/detach`, {
      params: { directory: currentWorkspace.path }
    });
    
    if (response.status === 200) {
      // Update workspace state
      currentWorkspace.isActive = false;
      
      // Close WebSocket connection if open
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      
      return { success: true };
    }
    return { 
      success: false, 
      error: `API returned status ${response.status}` 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to close shift' 
    };
  }
});

// Get current workspace status
ipcMain.handle('get-workspace-status', async () => {
  return currentWorkspace;
});

// WebSocket connection
const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8080/ws');

  console.log('Attempting to connect to websocket server');

  ws.on('open', () => {
    console.log('Connected to WebSocket Server');
  });

  ws.on('message', data => {
    try {
      console.log('Message from server:', data.toString());
      // Convert buffer/string to JSON
      const parsedData = JSON.parse(data.toString());

      // Send structured data to the renderer process
      // So we can easily add the data to the table in the workspace
      if (mainWindow) {
        mainWindow.webContents.send('websocket-message', parsedData);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket Disconnected, reconnecting...');
    setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
  });

  ws.on('error', err => {
    console.error('WebSocket Error:', err.message);
  });
};

// Window control handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    title: 'True Sight 1.0.0 OFBL Unit 5',
    icon: getAssetPath('icon.png'),
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 10 }, // Position traffic lights (macOS window controls)
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // Listen for window maximize/unmaximize events
  mainWindow.on('maximize', () => {
    if (mainWindow) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: true });
    }
  });

  mainWindow.on('unmaximize', () => {
    if (mainWindow) {
      mainWindow.webContents.send('window-state-changed', { isMaximized: false });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
