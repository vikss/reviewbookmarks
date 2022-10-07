import { getAllFolders } from './common.js';
let folderElem = document.getElementById("folder")
let bookmarkElem = document.getElementById("bookmark")
let removeElem = document.getElementById("remove")
let moveElem = document.getElementById("move")
let keepElem = document.getElementById("keep")
let doneElem = createPrimaryButton("Done");
let cancelElem = createPrimaryButton("Cancel")
let bookmark;
let bookmarkIndex = 0;
let bookmarkArr;


function render() {

    chrome.storage.sync.get("folder").then((data) => {
        folderElem.innerText = data.folder;

    });
    chrome.storage.sync.get("bookmarkIndex").then((data) => {
        bookmarkIndex = data.bookmarkIndex;
        getBookmarkArray().then((arr) => {
            bookmarkArr = arr;
            bookmark = bookmarkArr[bookmarkIndex];
            console.log(bookmarkArr); assignBookmark(bookmark)
        });

    });

    getFolders();

}
render();

function getBookmarkArray() {

    let promise = chrome.storage.sync.get("folderId").then((data) => {
        let promise = chrome.bookmarks.getChildren(data.folderId).then((arr) => {

            return arr;

        });
        return promise.then(bookmarkArr => bookmarkArr);
    });
    return promise.then(bookmarkArr => { console.log(bookmarkArr); return bookmarkArr });

}

function getNextBookmark(index) {
    let nextBookmark;
    bookmarkIndex = index;
    if (index < bookmarkArr.length) {

        if (bookmarkArr[bookmarkIndex].hasOwnProperty("dateGroupModified"))
            return getNextBookmark(++index);

        nextBookmark = bookmarkArr[bookmarkIndex];

    }
    chrome.storage.sync.set({ bookmarkIndex: bookmarkIndex });

    return nextBookmark;

}
function assignBookmark(bookmarkObj) {
    if (bookmarkObj && !bookmarkObj.hasOwnProperty("dateGroupModified")) {
        console.log('Current bookmark object is', bookmarkObj)
        bookmarkElem.innerText = bookmarkObj.title;
        bookmarkElem.href = bookmarkObj.url;
        bookmark = bookmarkObj;

    }
    else {

        document.getElementById("form").style.display = "none";
        document.getElementById("content").innerText = "Reached the end!"
    }

}
function getFolders() {


    getAllFolders().then(result => {
        for (let i = 0; i < result.length; i++) {
            let option = document.createElement("option");
            option.text = result[i].title;
            option.value = result[i].title;
            moveElem.appendChild(option)
        }
    })

}

bookmarkElem.addEventListener("click", (event) => {
    console.log(`Redirecting to ${bookmark.url}`);
    chrome.tabs.create({ url: bookmark.url });


});
moveElem.addEventListener("focus", (event) => {
    event.preventDefault();
    let div = document.getElementById("buttons");
    console.log(event.target.value);

    div.removeChild(removeElem);
    div.removeChild(keepElem);
    div.appendChild(doneElem);
    div.appendChild(cancelElem);



    cancelElem.addEventListener("click", (event) => {
        event.preventDefault();

        removeElem = createPrimaryButton("Remove")
        keepElem = createPrimaryButton("Keep")
        moveElem.selectedIndex = 0;
        div.removeChild(cancelElem);
        div.removeChild(doneElem);
        div.appendChild(keepElem);
        div.appendChild(removeElem);



    });

});

function createPrimaryButton(text) {
    let ele = document.createElement("button");
    ele.innerHTML = text;

    ele.classList.add("btn");
    ele.classList.add("btn-primary");
    return ele;

}

moveElem.addEventListener("change", (event) => {

    console.log(event.target.value);
    let folder = event.target.value;
    let promise = getAllFolders().then((folders) => {
        console.log("The folders", folders)
        let newFolder = folders.find(folderObj =>
            folderObj.title == folder
        );
        return newFolder;

    })
    let folderObj = promise.then(result => result);
    let destinationObj = folderObj.then(data => {
        let obj = { parentId: data.id };
        return obj;
    })

    destinationObj.then((obj) => {
        console.log(obj);
        let id = bookmark.id;
        let index = bookmarkIndex;
        doneElem.addEventListener("click", (event) => {
            event.preventDefault();
            chrome.bookmarks.move(id, obj).then((data) => {
                console.log("Successfully moved the bookmark.");
                moveElem.selectedIndex = 0;
                console.log(index);
                getBookmarkArray().then((arr) => {
                    bookmarkArr = arr;
                    bookmark = bookmarkArr[bookmarkIndex];
                    console.log(bookmarkArr);
                    assignBookmark(bookmark);
                });
                let div = document.getElementById("buttons");
                div.removeChild(cancelElem);
                div.removeChild(doneElem);
                div.appendChild(keepElem);
                div.appendChild(removeElem);
            }, (err) => { console.log("Encountered some error.") });


        })

    })

})
removeElem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Removing the bookmark", bookmark)

    chrome.bookmarks.remove(bookmark.id).then(() => {
        getBookmarkArray().then((arr) => {
            bookmarkArr = arr;
            setNewBookmark(bookmarkIndex);

        });

    })

})

function setNewBookmark(index) {

    let nextBookmark = getNextBookmark(index);
    assignBookmark(nextBookmark);

}

keepElem.addEventListener("click", (event) => {
    event.preventDefault();
    bookmarkIndex++;
    setNewBookmark(bookmarkIndex);


})
