const titleEl = document.getElementById("question-title");
const platformEl = document.getElementById("platform");
const slugEl = document.getElementById("slug");
const signalEl = document.getElementById("signal");
const detectedAtEl = document.getElementById("detected-at");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear");

const updateUI = (data) => {
  if (!data) {
    titleEl.textContent = "No question detected yet";
    platformEl.textContent = "—";
    slugEl.textContent = "—";
    signalEl.textContent = "Idle";
    detectedAtEl.textContent = "—";
    statusEl.textContent = "Listening";
    return;
  }

  titleEl.textContent = data.questionTitle || "Untitled";
  platformEl.textContent = data.platform || "—";
  slugEl.textContent = data.problemSlug ? `/${data.problemSlug}` : "—";
  signalEl.textContent = data.accepted ? "Accepted" : "Detected";
  detectedAtEl.textContent = data.detectedAt
    ? new Date(data.detectedAt).toLocaleTimeString()
    : "—";
  statusEl.textContent = data.accepted ? "Verified" : "Detected";
};

const load = async () => {
  const { cc_last_detection } = await chrome.storage.local.get("cc_last_detection");

  // Get current tab URL to ensure we are looking at the right problem
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !cc_last_detection) {
    updateUI(null);
    return;
  }

  // Check if current URL matches the detected problem's slug or at least the platform
  // This prevents "stale" state from showing up on random tabs
  const url = (tab.url || "").toLowerCase();
  const slug = (cc_last_detection.problemSlug || "").toLowerCase();
  const platform = (cc_last_detection.platform || "").toLowerCase();

  // Logic: 
  // 1. If we have a slug, the URL *must* contain it.
  // 2. OR if the URL contains the platform name (e.g. "leetcode", "geeksforgeeks").
  // 3. Special case for GFG: platform might be "GFG" but url has "geeksforgeeks"

  let match = false;
  if (slug && url.includes(slug)) {
    match = true;
  } else if (url.includes(platform)) {
    match = true;
  } else if (platform === "gfg" && url.includes("geeksforgeeks")) {
    match = true;
  }

  if (match) {
    updateUI(cc_last_detection);
  } else {
    // If we are on the dashboard, maybe we don't want to show "No question" but just "Idle"
    updateUI(null);
  }
};

clearBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("cc_last_detection");
  updateUI(null);
});

document.getElementById("debug").addEventListener("click", async () => {
  const { cc_last_detection } = await chrome.storage.local.get("cc_last_detection");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  alert(JSON.stringify({
    stored: cc_last_detection,
    currentTab: tab ? { title: tab.title, url: tab.url } : "No Tab"
  }, null, 2));
});

load();
