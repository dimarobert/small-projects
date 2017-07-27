chrome.runtime.onMessage.addListener((message: JQuery<HTMLElement>, sender, sendResponse) => {
    chrome.tabs.get(sender.tab.id, (r) => {
        console.log(r);
        sendResponse(r);
    });
    return true;
});
