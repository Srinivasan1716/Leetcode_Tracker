// Extension debug logging utility
const PREFIX = "[LeetCode Tracker]";

export const Logger = {
  log(...args) {
    console.log(PREFIX, new Date().toISOString(), ...args);
  },
  warn(...args) {
    console.warn(PREFIX, new Date().toISOString(), ...args);
  },
  error(...args) {
    console.error(PREFIX, new Date().toISOString(), ...args);
  }
};
