const { contextBridge, ipcRenderer } = require('electron');

export type Channels = 'camunda-8';

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: (event: typeof event, key: string) =>
    ipcRenderer.invoke('get-config', key),
  saveConfig: (event: typeof event, key: string) =>
    ipcRenderer.invoke('save-config', key),
  getQr: (event: typeof event, key: string) =>
    ipcRenderer.invoke('get-qr', key),
  homePath: () => ipcRenderer.invoke('home-path'),
});
