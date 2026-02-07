const API_URL = "http://localhost:5000/api/solve";

const getProblemTitle = () => {
  const titleEl = document.querySelector("h1") || document.querySelector(".problem-title");
  return titleEl ? titleEl.textContent.trim() : null;
};

const getProblemSlug = () => {
  const match = window.location.pathname.match(/problems\/([^/]+)/);
  return match ? match[1] : null;
};

const getHandle = () => {
  const profile = document.querySelector("a[href*='user/']");
  if (profile) {
    const match = profile.getAttribute("href").match(/user\/([^/]+)/);
    return match ? match[1] : null;
  }
  return null;
};

const hasAccepted = () => {
  const bodyText = document.body.innerText || "";
  return bodyText.includes("Correct Answer") || bodyText.includes("All test cases passed");
};

const updatePopup = (accepted) => {
  const payload = {
    platform: "GFG",
    questionTitle: getProblemTitle(),
    problemSlug: getProblemSlug(),
    detectedAt: new Date().toISOString(),
    accepted: Boolean(accepted)
  };
  chrome.storage.local.set({ cc_last_detection: payload });
};

const sendSolve = async () => {
  const payload = {
    platform: "GFG",
    questionTitle: getProblemTitle(),
    problemSlug: getProblemSlug(),
    handle: getHandle()
  };

  if (!payload.questionTitle) return;

  updatePopup(true);

  const key = `cc_gfg_${payload.problemSlug || payload.questionTitle}`;
  if (sessionStorage.getItem(key)) return;

  try {
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
