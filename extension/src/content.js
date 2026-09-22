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

function findSubmitButton() {
  return document.querySelector('[data-e2e-locator="console-submit-button"]') ||
         document.querySelector('button[data-cy="submit-code-btn"]') ||
         Array.from(document.querySelectorAll('button')).find(el => el.textContent.trim().toLowerCase() === 'submit');
}

function attachSubmitObserver() {
  const submitBtn = findSubmitButton();
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      console.log("[LeetCode Tracker] Submit button clicked, watching for result...");
      watchSubmissionResult();
    });
  }
}
setInterval(attachSubmitObserver, 2000);

function extractMonacoCode() {
  try {
    const lines = document.querySelectorAll('.monaco-editor .view-line');
    if (lines && lines.length > 0) {
      return Array.from(lines).map(line => line.textContent || '').join('\n');
    }
  } catch (err) {
    console.warn("[LeetCode Tracker] Failed to extract from DOM view-line:", err);
  }
  return "";
}
