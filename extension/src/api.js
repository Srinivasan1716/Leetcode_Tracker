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

export async function sendWithRetry(serverUrl, apiKey, payload, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await sendSubmissionToBackend(serverUrl, apiKey, payload);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
