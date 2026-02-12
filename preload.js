const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // update events
  onCheckingForUpdate: (callback) =>
    ipcRenderer.on("checking_for_update", callback),

  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update_available", callback),

  onUpdateNotAvailable: (callback) =>
    ipcRenderer.on("update_not_available", callback),

  onDownloadProgress: (callback) =>
    ipcRenderer.on("download_progress", callback),

  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update_downloaded", callback),

  onUpdateError: (callback) =>
    ipcRenderer.on("update_error", callback),

  // restart
  restartApp: () => ipcRenderer.send("restart_app"),
});
