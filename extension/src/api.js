// API Dispatcher module for LeetCode Tracker
export async function sendSubmissionToBackend(serverUrl, apiKey, payload) {
  const endpoint = `${serverUrl.replace(/\/+$/, '')}/user-problems/sync`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Client-Source': 'LeetCode-Tracker-Extension'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sync failed with HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}
