// Options page logic
document.addEventListener('DOMContentLoaded', () => {
  const serverUrlInput = document.getElementById('serverUrl');
  const dashboardUrlInput = document.getElementById('dashboardUrl');
  const apiKeyInput = document.getElementById('apiKey');
  const settingsForm = document.getElementById('settingsForm');
  const testBtn = document.getElementById('testBtn');
  const statusMessage = document.getElementById('statusMessage');

  chrome.storage.local.get(['serverUrl', 'dashboardUrl', 'apiKey'], (data) => {
    if (data.serverUrl) serverUrlInput.value = data.serverUrl;
    if (data.dashboardUrl) dashboardUrlInput.value = data.dashboardUrl;
    if (data.apiKey) apiKeyInput.value = data.apiKey;
  });

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const serverUrl = serverUrlInput.value.trim();
    const dashboardUrl = dashboardUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    chrome.storage.local.set({ serverUrl, dashboardUrl, apiKey }, () => {
      statusMessage.style.color = '#3fb950';
      statusMessage.textContent = 'Settings saved successfully!';
      setTimeout(() => { statusMessage.textContent = ''; }, 3000);
    });
  });

  testBtn.addEventListener('click', async () => {
    const serverUrl = serverUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    statusMessage.style.color = '#58a6ff';
    statusMessage.textContent = 'Testing backend connection...';

    try {
      const res = await fetch(`${serverUrl}/health`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (res.ok) {
        statusMessage.style.color = '#3fb950';
        statusMessage.textContent = 'Backend server reachable and verified!';
      } else {
        statusMessage.style.color = '#f85149';
        statusMessage.textContent = `Server responded with status: ${res.status}`;
      }
    } catch (err) {
      statusMessage.style.color = '#f85149';
      statusMessage.textContent = `Connection failed: ${err.message}`;
    }
  });
});
