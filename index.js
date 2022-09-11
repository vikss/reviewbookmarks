
let folderElem = document.getElementById("folders")
let bookmarkElem = document.getElementById("bookmark")
let removeElem = document.getElementById("remove")
let moveElem = document.getElementById("move")
let keepElem = document.getElementById("keep")
let bookmark;
let bookmarkIndex = 0;
let bookmarkArr;
let url;
chrome.bookmarks.getTree((node) => {
    chrome.storage.sync.get("folder", (data) => {
        folderElem.innerText = data.folder;

    });
    chrome.storage.sync.get("bookmarkIndex", (data) => {
        bookmarkIndex = data.bookmarkIndex;

        chrome.storage.sync.get("folderIndex", (data) => {
            bookmarkArr = node[0].children[data.folderIndex];
            bookmark = bookmarkArr.children[bookmarkIndex];
            assignBookmark(bookmark);

        });

    });




})
function setNextBookmark(index) {
    let nextBookmark;
    if (index < bookmarkArr.children.length) {
        bookmarkIndex = index;
        nextBookmark = bookmarkArr.children[bookmarkIndex];
        chrome.storage.sync.set({ bookmarkIndex: bookmarkIndex });
    }
    return nextBookmark;

}
function assignBookmark(bookmarkObj) {

    console.log('Bookmark object is', bookmarkObj)
    bookmarkElem.innerText = bookmarkObj.title;
    bookmarkElem.href = bookmarkObj.url;

    url = bookmarkObj.url;
    bookmarkElem.addEventListener("click", (event) => {
        console.log(`Redirecting to ${url}`);
        chrome.tabs.create({ url: url });

    });
}

removeElem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(bookmark)
    chrome.bookmarks.remove((bookmark.id), () => {
        console.log("Removed the bookmark.");

        setNewBookmark(bookmarkIndex);

    })
})
function setNewBookmark(index) {

    let nextBookmark = setNextBookmark(index);
    assignBookmark(nextBookmark);
}


moveElem.addEventListener("click", (event) => {
    event.preventDefault();

})
keepElem.addEventListener("click", (event) => {
    event.preventDefault();
    bookmarkIndex++;
    setNewBookmark(bookmarkIndex);

})
