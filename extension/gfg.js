const API_URL = "http://localhost:5000/api/solve";

const getProblemTitle = () => {
  // GFG structure changes often, document title is most reliable fallback
  // Format: "Problem Name | Practice | GeeksforGeeks"
  if (document.title && document.title.includes("|")) {
    return document.title.split("|")[0].trim();
  }

  const titleEl = document.querySelector(".problem-title") || document.querySelector("h3");
  if (titleEl) return titleEl.textContent.trim();

  return null;
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
  // Check for the specific success modal or text
  const successModal = document.querySelector(".problemSubmission_submissionResult__3S8q3");
  if (successModal && successModal.innerText.includes("Correct Answer")) return true;

  const bodyText = document.body.innerText || "";
  return bodyText.includes("Correct Answer") && bodyText.includes("Total Time Taken");
};

const updatePopup = (accepted) => {
  if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
    console.warn("CodeCanon: Chrome storage API not available.");
    return;
  }

  try {
    const payload = {
      platform: "GFG",
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
