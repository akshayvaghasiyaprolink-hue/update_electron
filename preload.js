const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateAvailable: (callback) => ipcRenderer.on("update_available", callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on("update_downloaded", callback),

  onUpdateStatus: (callback) => ipcRenderer.on("update_status", callback),

  restartApp: () => ipcRenderer.send("restart_app"),
});
