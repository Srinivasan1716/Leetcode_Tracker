// Background service worker for LeetCode Tracker Sync
console.log("[LeetCode Tracker] Background service worker initialized.");

chrome.runtime.onInstalled.addListener((details) => {
  console.log("[LeetCode Tracker] Installed reason:", details.reason);
  chrome.storage.local.set({
    autoSyncEnabled: true,
    serverUrl: "http://localhost:5000/api",
    offlineQueue: [],
    syncLogs: []
  });
});
