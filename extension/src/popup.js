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

function renderRecentSubmissions(items) {
  const recentList = document.getElementById('recent-list');
  if (!recentList) return;
  if (items.length === 0) {
    recentList.innerHTML = '<p class="empty-state">No submissions synced yet.</p>';
    return;
  }

  recentList.innerHTML = items.slice(0, 5).map(item => `
    <div class="submission-item">
      <div>
        <div class="title">${item.title || item.slug}</div>
        <div style="font-size: 10px; color: #8b949e;">${item.language} &bull; ${item.runtime || ''}</div>
      </div>
      <span class="difficulty-badge ${item.difficulty || 'MEDIUM'}">${item.difficulty || 'MED'}</span>
    </div>
  `).join('');
}
