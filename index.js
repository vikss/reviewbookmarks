let folderElem = document.getElementById("folder")
let bookmarkElem = document.getElementById("bookmark")
let removeElem = document.getElementById("remove")
let moveElem = document.getElementById("move")
let keepElem = document.getElementById("keep")
let bookmark;
let bookmarkIndex = 0;
let allFolders = [];
let bookmarkArr;
let folderIndex;
let url;
function render() {

    chrome.storage.sync.get("folder", (data) => {
        folderElem.innerText = data.folder;

    });
    chrome.storage.sync.get("bookmarkIndex", (data) => {
        bookmarkIndex = data.bookmarkIndex;

        chrome.storage.sync.get("folderId", (data) => {
            chrome.bookmarks.getChildren(data.folderId, (arr) => {
                bookmarkArr = arr;
                bookmark = arr[bookmarkIndex];
                assignBookmark(bookmark);


            })


        });

    });

    getFolders();

}
render();

function setNextBookmark(index) {
    let nextBookmark;
    console.log(bookmarkArr)
    if (index < bookmarkArr.length) {
        bookmarkIndex = index;
        nextBookmark = bookmarkArr[bookmarkIndex];
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
        bookmark = bookmarkObj;


        document.createElement("option");

    }
    else {

        document.getElementById("form").style.display = "none";
        document.getElementById("content").innerText = "Reached the end!"
    }


}
function getFolders() {

    let res = [];
    chrome.bookmarks.getTree((node) => {
        let topFolders = node[0].children;

        for (let i = 0; i < topFolders.length; i++) {
            res.push(topFolders[i]);
            let option = document.createElement("option");
            option.text = topFolders[i].title;
            option.value = topFolders[i].title;
            moveElem.appendChild(option)
            chrome.bookmarks.getChildren(topFolders[i].id, (arr) => {
                let a = arr.filter(node => node.hasOwnProperty("dateGroupModified"));
                a.forEach(ele => {

                    let element = document.createElement("option");
                    element.text = ele.title;
                    element.value = ele.title;
                    moveElem.appendChild(element);

                    res.push(ele)
                });


            })
        }
    }

    )


}

bookmarkElem.addEventListener("click", (event) => {
    console.log(`Redirecting to ${url}`);
    chrome.tabs.create({ url: url });


});
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes)
    console.log(namespace)
})
moveElem.addEventListener("click", (event) => {

   

})
removeElem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(bookmark)
    chrome.bookmarks.remove((bookmark.id), () => {
        console.log("Removed the bookmark.");
        chrome.bookmarks.getTree((node) => {


            bookmarkArr = node[0].children[folderIndex];
            console.log(bookmarkArr);
            setNewBookmark(bookmarkIndex);
        });




    })


})

function setNewBookmark(index) {

    let nextBookmark = setNextBookmark(index);

    assignBookmark(nextBookmark);

}



keepElem.addEventListener("click", (event) => {
    event.preventDefault();
    bookmarkIndex++;
    setNewBookmark(bookmarkIndex);


})
