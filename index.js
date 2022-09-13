
let folderElem = document.getElementById("folders")
let bookmarkElem = document.getElementById("bookmark")
let removeElem = document.getElementById("remove")
let moveElem = document.getElementById("move")
let keepElem = document.getElementById("keep")
let bookmark;
let bookmarkIndex = 0;
let bookmarkArr;
let folderIndex;
let url;
chrome.bookmarks.getTree((node) => {
    chrome.storage.sync.get("folder", (data) => {
        folderElem.innerText = data.folder;

    });
    chrome.storage.sync.get("bookmarkIndex", (data) => {
        bookmarkIndex = data.bookmarkIndex;

        chrome.storage.sync.get("folderIndex", (data) => {
            folderIndex = data.folderIndex;
            bookmarkArr = node[0].children[folderIndex];
            bookmark = bookmarkArr.children[bookmarkIndex];
            assignBookmark(bookmark);

        });

    });




})
function setNextBookmark(index) {
    let nextBookmark;
    console.log(bookmarkArr.children)
    //debugger;
    if (index < bookmarkArr.children.length) {
        bookmarkIndex = index;
        nextBookmark = bookmarkArr.children[bookmarkIndex];
        chrome.storage.sync.set({ bookmarkIndex: bookmarkIndex });
    }


    return nextBookmark;

}
function assignBookmark(bookmarkObj) {
    if (bookmarkObj) {
        console.log('Bookmark object is', bookmarkObj)
        bookmarkElem.innerText = bookmarkObj.title;
        bookmarkElem.href = bookmarkObj.url;

        url = bookmarkObj.url;
        console.log(bookmarkObj);
    }
    else {

        document.getElementById("form").style.display = "none";
        document.getElementById("content").innerText = "Reached the end!"
    }


}
bookmarkElem.addEventListener("click", (event) => {
    console.log(`Redirecting to ${url}`);
    chrome.tabs.create({ url: url });


});
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes)
    console.log(namespace)
})

removeElem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(bookmark)
    chrome.bookmarks.remove((bookmark.id), () => {
        console.log("Removed the bookmark.");
        chrome.bookmarks.getTree((node) => {


            bookmarkArr = node[0].children[folderIndex];
            console.log(bookmarkArr);
            //debugger;
            setNewBookmark(bookmarkIndex);
        });




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
