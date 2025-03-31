// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'window-minimize' | 'window-maximize' | 'window-close' | 'window-state-changed' | 'websocket-message';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  window: {
    minimize() {
      ipcRenderer.send('window-minimize');
    },
    maximize() {
      ipcRenderer.send('window-maximize');
    },
    close() {
      ipcRenderer.send('window-close');
    },
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  },
  workspace: {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    activateWorkspace: (folderPath: string) => 
      ipcRenderer.invoke('activate-workspace', folderPath),
    closeShift: () => ipcRenderer.invoke('close-shift'),
    getStatus: () => ipcRenderer.invoke('get-workspace-status'),
  },
  websocket: {
    onMessage: (callback: (data: any) => void) => {
      const subscription = (_event: IpcRendererEvent, data: any) => callback(data);
      ipcRenderer.on('websocket-message', subscription);
      return () => {
        ipcRenderer.removeListener('websocket-message', subscription);
      };
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
