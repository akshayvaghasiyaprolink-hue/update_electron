const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

let mainWindow;

// ✅ Logging setup
log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// ✅ Fix for Squirrel Startup Events (without installing electron-squirrel-startup)
if (process.platform === "win32") {
  const squirrelEvent = process.argv[1];

  if (squirrelEvent && squirrelEvent.startsWith("--squirrel")) {
    app.quit();
  }
}

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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  log.info("App Started...");
  log.info("App Version: " + app.getVersion());

  // ✅ Check update after window ready
  setTimeout(() => {
    log.info("Checking for updates...");
    autoUpdater.checkForUpdatesAndNotify();
  }, 2000);

  // ✅ Update Events
  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");
    mainWindow?.webContents.send("update_status", "Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("Update available: " + JSON.stringify(info));
    mainWindow?.webContents.send("update_available");
    mainWindow?.webContents.send("update_status", "Update available... Downloading...");
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("Update not available: " + JSON.stringify(info));
    mainWindow?.webContents.send("update_status", "You already have the latest version.");
  });

  autoUpdater.on("error", (err) => {
    log.error("Update error: " + err.toString());
    mainWindow?.webContents.send("update_status", "Update error: " + err.message);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    let msg = `Downloading: ${Math.round(progressObj.percent)}%`;
    log.info(msg);
    mainWindow?.webContents.send("update_status", msg);
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("Update downloaded: " + JSON.stringify(info));
    mainWindow?.webContents.send("update_downloaded");
    mainWindow?.webContents.send("update_status", "Update downloaded. Restart to install.");
  });
});

// ✅ Restart & Install Update
ipcMain.on("restart_app", () => {
  log.info("Restart button clicked. Installing update...");
  autoUpdater.quitAndInstall();
});

// ✅ Quit app when all windows closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
