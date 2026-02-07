const API_URL = "http://localhost:5000/api/solve";

const getProblemSlug = () => {
  const match = window.location.pathname.match(/problems\/([^/]+)/);
  return match ? match[1] : null;
};

const getProblemTitle = () => {
  const titleEl = document.querySelector("[data-cy='question-title']") || document.querySelector("h1");
  return titleEl ? titleEl.textContent.trim() : null;
};

const getHandle = () => {
  return (
    window.leetcodeConfig?.userName ||
    window.__INITIAL_STATE__?.user?.username ||
    null
  );
};

const hasAccepted = () => {
  const bodyText = document.body.innerText || "";
  return bodyText.includes("Accepted") || bodyText.includes("All test cases passed");
};

const updatePopup = (accepted) => {
  const payload = {
    platform: "LeetCode",
    questionTitle: getProblemTitle(),
    problemSlug: getProblemSlug(),
    detectedAt: new Date().toISOString(),
    accepted: Boolean(accepted)
  };
  chrome.storage.local.set({ cc_last_detection: payload });
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
  } catch (error) {
    console.warn("CodeCanon solve push failed", error);
  }
};

const observer = new MutationObserver(() => {
  const accepted = hasAccepted();
  if (accepted) {
    sendSolve();
  } else {
    updatePopup(false);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

if (hasAccepted()) {
  sendSolve();
} else {
  updatePopup(false);
}
