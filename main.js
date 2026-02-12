const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

if (require("electron-squirrel-startup")) {
  app.quit();
}

log.transports.file.level = "info";
autoUpdater.logger = log;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");
  });

  autoUpdater.on("update-available", () => {
    log.info("Update available");
    mainWindow.webContents.send("update_available");
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No update available");
  });

  autoUpdater.on("error", (err) => {
    log.error("Updater error:", err);
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info("Download progress:", progress);
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded");
    mainWindow.webContents.send("update_downloaded");
  });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
