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

async function flushOfflineQueue() {
  chrome.storage.local.get(['offlineQueue', 'serverUrl', 'apiKey'], async (data) => {
    const queue = data.offlineQueue || [];
    if (queue.length === 0 || !data.apiKey) return;

    console.log(`[LeetCode Tracker] Retrying ${queue.length} offline submissions...`);
    const remaining = [];
    for (const item of queue) {
      try {
        const endpoint = `${(data.serverUrl || 'http://localhost:5000/api').replace(/\/+$/, '')}/user-problems/sync`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.apiKey}`
          },
          body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error("HTTP error " + res.status);
        console.log("[LeetCode Tracker] Flushed submission:", item.slug);
      } catch (err) {
        remaining.push(item);
      }
    }
    chrome.storage.local.set({ offlineQueue: remaining });
  });
}

chrome.alarms.create("retryOfflineQueue", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "retryOfflineQueue") flushOfflineQueue();
});

// Batch synchronization helper for past solved problem items
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'BATCH_SYNC_SUBMISSIONS') {
    console.log(`[LeetCode Tracker] Batch syncing ${msg.items?.length || 0} problems.`);
    sendResponse({ status: 'ACCEPTED_FOR_SYNC' });
  }
});

function updateBadgeCounter(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: String(count) });
    chrome.action.setBadgeBackgroundColor({ color: '#f85149' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}
