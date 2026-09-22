// Content script injected into LeetCode problem pages
console.log("[LeetCode Tracker] Content script active on LeetCode.");

let isListening = false;
function initSubmissionWatcher() {
  if (isListening) return;
  isListening = true;
  console.log("[LeetCode Tracker] Initializing submit button observer...");
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initSubmissionWatcher();
} else {
  window.addEventListener("DOMContentLoaded", initSubmissionWatcher);
}
