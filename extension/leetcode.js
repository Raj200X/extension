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

const getHandle = () => {
  return (
    window.leetcodeConfig?.userName ||
    window.__INITIAL_STATE__?.user?.username ||
    // Try to find username in the navbar
    document.querySelector("a[href^='/u/']")?.getAttribute("href")?.split("/")[2] ||
    null
  );
};

const hasAccepted = () => {
  // New UI
  const successText = document.querySelector("[data-e2e-locator='submission-result']");
  if (successText && successText.innerText.includes("Accepted")) return true;

  // Old UI / General
  const bodyText = document.body.innerText || "";
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

const sendSolve = async () => {
  const payload = {
    platform: "LeetCode",
    questionTitle: getProblemTitle(),
    problemSlug: getProblemSlug(),
    handle: getHandle()
  };

  if (!payload.questionTitle) return;

  updatePopup(true);

  const key = `cc_leetcode_${payload.problemSlug || payload.questionTitle}`;
  if (sessionStorage.getItem(key)) return;

  try {
    // Send message to background script
    chrome.runtime.sendMessage({
      type: "SOLVE_DETECTED",
      payload
    });
    sessionStorage.setItem(key, "1");
    // Show a small toast notification
    const toast = document.createElement("div");
    toast.textContent = "CodeCanon: Solve Detected!";
    toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; z-index: 9999; font-family: sans-serif; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.1); opacity: 0; transition: opacity 0.3s;";
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.opacity = "1");
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);

  } catch (error) {
    console.warn("CodeCanon solve push failed", error);
  }
};

// Polling is often more reliable than MutationObserver for specific text changes across complex SPAs
setInterval(() => {
  const accepted = hasAccepted();
  if (accepted) {
    sendSolve();
  } else {
    // Only update to false if we actulaly have a problem loaded
    if (getProblemSlug()) {
      updatePopup(false);
    }
  }
}, 2000);
