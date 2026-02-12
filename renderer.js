const status = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

window.electronAPI.onUpdateStatus((event, message) => {
  status.innerText = message;
});

window.electronAPI.onUpdateAvailable(() => {
  status.innerText = "⬇️ Update Available... Downloading...";
});

window.electronAPI.onUpdateDownloaded(() => {
  status.innerText = "✅ Update Downloaded. Restart to Install!";
  restartBtn.style.display = "block";
});

restartBtn.addEventListener("click", () => {
  window.electronAPI.restartApp();
});
