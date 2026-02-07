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
  updateUI(cc_last_detection);
};

clearBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("cc_last_detection");
  updateUI(null);
});

load();
