const status = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

restartBtn.style.display = "none";

// checking
window.electronAPI.onCheckingForUpdate(() => {
  status.innerText = "🔍 Checking for updates...";
});

// update available
window.electronAPI.onUpdateAvailable(() => {
  status.innerText = "⬇️ Update Available... Downloading...";
});

// progress
window.electronAPI.onDownloadProgress((event, progress) => {
  status.innerText = `⬇️ Downloading Update... ${progress.percent.toFixed(2)}%`;
});

// downloaded
window.electronAPI.onUpdateDownloaded(() => {
  status.innerText = "✅ Update Downloaded. Restart to Install!";
  restartBtn.style.display = "block";
});

// no update
window.electronAPI.onUpdateNotAvailable(() => {
  status.innerText = "✅ You already have the latest version.";
});

// error
window.electronAPI.onUpdateError((event, errorMsg) => {
  status.innerText = "❌ Update Error: " + errorMsg;
});

// restart
restartBtn.addEventListener("click", () => {
  window.electronAPI.restartApp();
});
