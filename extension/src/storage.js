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
