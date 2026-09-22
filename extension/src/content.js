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

function detectProgrammingLanguage() {
  const langBtn = document.querySelector('[data-cy="lang-select"]') ||
                  document.querySelector('button[id*="headlessui-listbox-button"]');
  if (langBtn) {
    const text = langBtn.textContent.trim().toLowerCase();
    if (text.includes('python')) return 'python3';
    if (text.includes('c++') || text.includes('cpp')) return 'cpp';
    if (text.includes('java')) return 'java';
    if (text.includes('javascript') || text.includes('js')) return 'javascript';
    if (text.includes('typescript') || text.includes('ts')) return 'typescript';
    if (text.includes('golang') || text.includes('go')) return 'go';
    if (text.includes('rust')) return 'rust';
    if (text.includes('c#') || text.includes('csharp')) return 'csharp';
  }
  return 'python3';
}

function extractRuntimeAndMemory() {
  let runtime = "N/A";
  let memory = "N/A";
  const resultContainers = document.querySelectorAll('span, div');
  resultContainers.forEach(el => {
    const text = el.textContent || '';
    if (/Runtime[:\s]+(\d+\s*ms)/i.test(text)) {
      runtime = text.match(/Runtime[:\s]+(\d+\s*ms)/i)[1];
    }
    if (/Memory[:\s]+([\d.]+\s*MB)/i.test(text)) {
      memory = text.match(/Memory[:\s]+([\d.]+\s*MB)/i)[1];
    }
  });
  return { runtime, memory };
}

function watchSubmissionResult() {
  let checks = 0;
  const interval = setInterval(() => {
    checks++;
    const acceptedBanner = Array.from(document.querySelectorAll('*')).find(el =>
      el.textContent && el.textContent.trim() === 'Accepted' && el.classList.contains('text-green-s') ||
      el.getAttribute('data-e2e-locator') === 'submission-result' ||
      el.textContent.includes('Accepted')
    );

    if (acceptedBanner) {
      clearInterval(interval);
      console.log("[LeetCode Tracker] Submission verified as ACCEPTED!");
      captureAndTransmitSubmission();
    }
    if (checks > 30) clearInterval(interval);
  }, 1000);
}

function captureAndTransmitSubmission() {
  const { slug, title } = parseProblemSlugAndTitle();
  const difficulty = parseDifficulty();
  const language = detectProgrammingLanguage();
  const { runtime, memory } = extractRuntimeAndMemory();
  const code = extractMonacoCode();

  const payload = {
    slug,
    title,
    difficulty,
    language,
    runtime,
    memory,
    code,
    submittedAt: new Date().toISOString(),
    status: 'ACCEPTED'
  };

  chrome.runtime.sendMessage({ action: 'SYNC_SUBMISSION', payload });
}

// Support LeetCode v2 modern Next.js UI layout variations
function detectLeetCodeLayout() {
  const isDynamicLayout = !!document.querySelector('#qd-content') || !!document.querySelector('.relative.flex.h-full.w-full');
  console.log(`[LeetCode Tracker] Detected layout: ${isDynamicLayout ? 'Dynamic v2' : 'Standard'}`);
  return isDynamicLayout;
}

function extractProblemTags() {
  const tagElements = document.querySelectorAll('a[href*="/tag/"]');
  const tags = Array.from(tagElements).map(el => el.textContent.trim()).filter(Boolean);
  return Array.from(new Set(tags));
}

let lastClickTime = 0;
function isDebouncedClick() {
  const now = Date.now();
  if (now - lastClickTime < 3000) {
    console.log("[LeetCode Tracker] Ignored duplicate rapid submission click.");
    return true;
  }
  lastClickTime = now;
  return false;
}

function showToastNotification(message, isError = false) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '999999';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '8px';
  toast.style.background = isError ? '#da3633' : '#238636';
  toast.style.color = '#ffffff';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  toast.textContent = `[LeetCode Tracker] ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
