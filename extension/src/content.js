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

function hookNetworkSubmissions() {
  const originalFetch = window.fetch;
  if (window.fetch) {
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "LEETCODE_SUBMISSION_SUCCESS") {
        handleAcceptedSubmission(event.data.payload);
      }
    });
  }
}

function parseProblemSlugAndTitle() {
  const urlPath = window.location.pathname;
  const match = urlPath.match(/\/problems\/([^/]+)/);
  const slug = match ? match[1] : "unknown-problem";
  const titleEl = document.querySelector('[data-cy="question-title"]') || document.querySelector('.text-title-large');
  const title = titleEl ? titleEl.textContent.trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { slug, title };
}

function parseDifficulty() {
  const diffEl = document.querySelector('[data-degree]') ||
                 document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard') ||
                 Array.from(document.querySelectorAll('div, span')).find(el => ['Easy', 'Medium', 'Hard'].includes(el.textContent.trim()));
  if (diffEl) {
    const text = diffEl.textContent.trim();
    if (/easy/i.test(text)) return 'EASY';
    if (/medium/i.test(text)) return 'MEDIUM';
    if (/hard/i.test(text)) return 'HARD';
  }
  return 'MEDIUM';
}
