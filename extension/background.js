const API_URL = "http://localhost:5000/api/solve";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "SOLVE_DETECTED") {
        const payload = message.payload;
        console.log("CodeCanon Background: Received SOLVE_DETECTED", payload);

        // Return true to indicate async response
        // sendResponse({ status: "RECEIVED" });  // logic here is async, we can just log for now

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
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    console.log("CodeCanon solve pushed successfully", data);
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "SOLVE_STATUS",
                        status: "SUCCESS",
                        data
                    });
                } else if (response.status === 404) {
                    console.warn("CodeCanon question not tracked", data);
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "SOLVE_STATUS",
                        status: "NOT_TRACKED",
                        message: data.message
                    });
                } else {
                    console.warn("CodeCanon solve push failed", response.status, data);
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: "SOLVE_STATUS",
                        status: "ERROR",
                        message: data.message || "Unknown error"
                    });
                }
            })
            .catch(error => {
                console.warn("CodeCanon solve push network error", error);
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "SOLVE_STATUS",
                    status: "ERROR",
                    message: "Network error"
                });
            });
    }
});
