// Storage management utilities for extension
export const StorageManager = {
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['serverUrl', 'apiKey', 'autoSyncEnabled', 'offlineQueue', 'recentSyncs'],
        (items) => resolve(items)
      );
    });
  },

  async setSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.local.set(settings, () => resolve(true));
    });
  },

  async saveRecentSync(item) {
    const { recentSyncs = [] } = await this.getSettings();
    const updated = [item, ...recentSyncs.slice(0, 19)];
    await this.setSettings({ recentSyncs: updated });
  }
};

export async function enqueueOfflineSubmission(submission) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['offlineQueue'], (data) => {
      const queue = data.offlineQueue || [];
      queue.push({ ...submission, queuedAt: new Date().toISOString() });
      chrome.storage.local.set({ offlineQueue: queue }, () => {
        console.log("[LeetCode Tracker] Submission enqueued offline:", submission.slug);
        resolve(queue.length);
      });
    });
  });
}
