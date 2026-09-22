# LeetCode Tracker Chrome Extension

This Chrome Extension (Manifest V3) automatically captures your accepted LeetCode submissions and securely transmits them to your **LeetCode Tracker Web Application**.

## Features
- Intercepts code, language, runtime, memory, and tags when clicking "Submit" on LeetCode.
- Real-time sync with local/remote backend API.
- Offline queueing with automatic background retries via alarms.
- Dark theme popup and options control panel.

## Installation
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select this `extension/` folder.
4. Click extension icon, open Settings, and enter your API Token.
