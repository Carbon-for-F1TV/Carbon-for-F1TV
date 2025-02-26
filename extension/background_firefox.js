// F1TV currently blocks Firefox; this makes it appear as Edge.
const targetWebsite = "*://f1tv.formula1.com/*";
const newUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/131.0.2903.86";

browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        for (let header of details.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = newUserAgent;
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: [targetWebsite] },
    ["blocking", "requestHeaders"]
);