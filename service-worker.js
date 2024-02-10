chrome.runtime.onInstalled.addListener((details) => {
    console.log(details)
    if (details.reason == "install") {

        chrome.storage.sync.set({ "bookmarkIndex": 0, "folder": "Bookmarks bar", "folderId": "1" }).
            then((res) => console.log("Initialized the addin with the default folder"))

    }
    console.log("Service worker was run")

})