// Popup UI Script
document.addEventListener('DOMContentLoaded', async () => {
  const autoSyncToggle = document.getElementById('autoSyncToggle');
  const statusBadge = document.getElementById('status-badge');
  const recentList = document.getElementById('recent-list');
  const syncNowBtn = document.getElementById('syncNowBtn');
  const openOptionsBtn = document.getElementById('openOptionsBtn');
  const openDashboardBtn = document.getElementById('openDashboardBtn');

  // Load configuration
  chrome.storage.local.get(['autoSyncEnabled', 'apiKey', 'serverUrl', 'recentSyncs'], (data) => {
    if (autoSyncToggle) autoSyncToggle.checked = data.autoSyncEnabled !== false;
    
    if (data.apiKey) {
      statusBadge.textContent = "Connected";
      statusBadge.className = "status-badge connected";
    } else {
      statusBadge.textContent = "No API Key";
      statusBadge.className = "status-badge disconnected";
    }

    renderRecentSubmissions(data.recentSyncs || []);
  });

  if (autoSyncToggle) {
    autoSyncToggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ autoSyncEnabled: e.target.checked });
    });
  }
});
