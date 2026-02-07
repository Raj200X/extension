const API_URL = "http://localhost:5000/api/solve";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SOLVE_DETECTED") {
        const { payload } = message;

        // Update local storage for popup
        chrome.storage.local.set({
            cc_last_detection: {
                ...payload,
                detectedAt: new Date().toISOString(),
                accepted: true
            }
        });

        const key = `cc_${payload.platform.toLowerCase()}_${payload.problemSlug || payload.questionTitle}`;

        // Ideally checking session storage here is tricky since background SW is ephemeral.
        // relying on the content script to check its own session storage before sending is better.
        // However, we can just fire the request.

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    console.log("CodeCanon solve pushed successfully");
                } else {
                    console.warn("CodeCanon solve push failed", response.status);
                }
            })
            .catch(error => {
                console.warn("CodeCanon solve push network error", error);
            });
    }
});
