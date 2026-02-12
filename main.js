const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

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

  log.info("✅ App started...");
  log.info("App Version:", app.getVersion());

  autoUpdater.autoDownload = true;

  setTimeout(() => {
    log.info("🔍 Checking for updates...");
    autoUpdater.checkForUpdatesAndNotify();
  }, 2000);

  autoUpdater.on("checking-for-update", () => {
    log.info("🔍 Checking for update...");
    mainWindow.webContents.send("checking_for_update");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("✅ Update available:", info);
    mainWindow.webContents.send("update_available", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("❌ No update available:", info);
    mainWindow.webContents.send("update_not_available", info);
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info("⬇ Download progress:", progress.percent);
    mainWindow.webContents.send("download_progress", progress);
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("✅ Update downloaded:", info);
    mainWindow.webContents.send("update_downloaded", info);
  });

  autoUpdater.on("error", (err) => {
    log.error("🚨 Update error:", err);
    mainWindow.webContents.send("update_error", err.toString());
  });
});

ipcMain.on("restart_app", () => {
  log.info("🔁 Restarting app to install update...");
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
