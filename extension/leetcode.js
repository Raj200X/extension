const API_URL = "http://localhost:5000/api/solve";

const getProblemSlug = () => {
  const match = window.location.pathname.match(/problems\/([^/]+)/);
  return match ? match[1] : null;
};

const getProblemTitle = () => {
  const titleEl = document.querySelector(".text-title-large") || document.querySelector("[data-cy='question-title']") || document.querySelector("h1");
  if (titleEl) {
    // Remove the number prefix if present (e.g., "1. Two Sum" -> "Two Sum")
    return titleEl.textContent.replace(/^\d+\.\s*/, "").trim();
  }

  // Method 2: Document Title Parsing (e.g. "Two Sum - LeetCode")
  if (document.title) {
    return document.title.split(" - ")[0].replace(/^\d+\.\s*/, "").trim();
  }
  return null;
};

// 1. Inject script to access page variables (window.leetcodeConfig)
const injectScript = () => {
  const script = document.createElement('script');
  script.textContent = `
    setTimeout(() => {
      const user = window.leetcodeConfig?.userName || window.__INITIAL_STATE__?.user?.username;
      window.postMessage({ type: "CC_USER_INFO", username: user }, "*");
    }, 1000); // Wait a bit for LeetCode to init
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};

let cachedHandle = null;

// 2. Listen for the handle
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type === "CC_USER_INFO" && event.data.username) {
    cachedHandle = event.data.username;
    console.log("CodeCanon: Captured handle from page context:", cachedHandle);
  }
});

injectScript();

const getHandle = () => {
  // If we have cached handle from script injection, use it
  if (cachedHandle) return cachedHandle;

  // Fallback: Try to find username in the navbar
  return document.querySelector("a[href^='/u/']")?.getAttribute("href")?.split("/")[2] || null;
};

const hasAccepted = () => {
  // New UI
  const successText = document.querySelector("[data-e2e-locator='submission-result']");
  if (successText) {
    console.log("CodeCanon: Found submission-result element", successText.innerText);
  }
  if (successText && successText.innerText.includes("Accepted")) return true;

  // Old UI / General
  const bodyText = document.body.innerText || "";
  // console.log("CodeCanon: Checking body text for success...");
  return bodyText.includes("Success") && bodyText.includes("Details") && bodyText.includes("Runtime");
};

const updatePopup = (accepted) => {
  if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
    console.warn("CodeCanon: Chrome storage API not available.");
    return;
  }

  try {
    const payload = {
      platform: "LeetCode",
      questionTitle: getProblemTitle(),
      problemSlug: getProblemSlug(),
      detectedAt: new Date().toISOString(),
      accepted: Boolean(accepted)
    };
    chrome.storage.local.set({ cc_last_detection: payload });
  } catch (err) {
    console.warn("CodeCanon: Failed to update popup state.", err);
  }
};

// Toast Helper
const showToast = (message, type = "info") => {
  const existingToast = document.getElementById("cc-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "cc-toast";
  toast.textContent = message;

  let bg = "#3b82f6"; // blue
  if (type === "success") bg = "#10b981"; // green
  if (type === "error") bg = "#ef4444"; // red
  if (type === "warning") bg = "#f59e0b"; // yellow

  toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${bg}; color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000; font-family: sans-serif; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.3s; pointer-events: none;`;
  document.body.appendChild(toast);

  // Force reflow
  toast.offsetHeight;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Listen for background messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SOLVE_STATUS") {
    if (message.status === "SUCCESS") {
      showToast("Synced with CodeCanon!", "success");
    } else if (message.status === "NOT_TRACKED") {
      showToast("Question not tracked by CodeCanon", "warning");
    } else {
      // Improve error message
      let msg = message.message;
      if (msg && msg.includes("Missing handle")) {
        msg = "Log in to LeetCode first.";
      }
      // Handle the "No CodeCanon account" error specifically if needed, 
      // but showing the message directly is usually good.
      showToast(`Sync Failed: ${msg}`, "error");
    }
  }
});

const sendSolve = async () => {
  let handle = getHandle();

  // Retry getting handle if missing (sometimes script injection is slow)
  if (!handle) {
    console.log("CodeCanon: Handle not found immediately, retrying...");
    await new Promise(r => setTimeout(r, 500));
    handle = getHandle();
  }

  const payload = {
    platform: "LeetCode",
    questionTitle: getProblemTitle(),
    problemSlug: getProblemSlug(),
    handle: handle
  };

  if (!payload.questionTitle) return;

  updatePopup(true);

  const key = `cc_leetcode_${payload.problemSlug || payload.questionTitle}`;
  // if (sessionStorage.getItem(key)) return; // Disable deduplication for debugging

  try {
    showToast("Syncing with CodeCanon...", "info");
    const payloadLog = { ...payload }; // Log full payload for debugging
    console.log("CodeCanon: Sending SOLVE_DETECTED message to background...", payloadLog);

    // Send message to background script
    chrome.runtime.sendMessage({
      type: "SOLVE_DETECTED",
      payload
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("CodeCanon: Message sending failed", chrome.runtime.lastError);
        showToast("Extension connection failed", "error");
      } else {
        console.log("CodeCanon: Message sent successfully", response);
      }
    });
    sessionStorage.setItem(key, "1");

  } catch (error) {
    console.warn("CodeCanon solve push failed", error);
    showToast("Extension Error", "error");
  }
};

// Polling is often more reliable than MutationObserver for specific text changes across complex SPAs
setInterval(() => {
  const accepted = hasAccepted();
  if (accepted) {
    console.log("CodeCanon: 'Accepted' text found in DOM!");
    sendSolve();
  } else {
    // Only update to false if we actulaly have a problem loaded
    const slug = getProblemSlug();
    if (slug) {
      // console.log("CodeCanon: Problem found, but not accepted yet:", slug);
      updatePopup(false);
    }
  }
}, 2000);
