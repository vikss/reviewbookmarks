import {getAllFolders} from './common.js';
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
            folderIndex = data.folderId;
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
    bookmarkIndex = index;
    if (index < bookmarkArr.length) {
        
        if(bookmarkArr[bookmarkIndex].hasOwnProperty("dateGroupModified"))
         return setNextBookmark(++index);
        
        nextBookmark = bookmarkArr[bookmarkIndex];
        
      
        
    }
    chrome.storage.sync.set({ bookmarkIndex: bookmarkIndex });

    return nextBookmark;

}
function assignBookmark(bookmarkObj) {
    if (bookmarkObj) {
        console.log('Bookmark object is', bookmarkObj)
        bookmarkElem.innerText = bookmarkObj.title;
        bookmarkElem.href = bookmarkObj.url;

        url = bookmarkObj.url;
        bookmark = bookmarkObj;

    }
    else {

        document.getElementById("form").style.display = "none";
        document.getElementById("content").innerText = "Reached the end!"
    }
console.log(getAllFolders())

}
function getFolders() {

   
    let result = getAllFolders()
    console.log(result)
    for(let i=0;i<result.length;i++){
        let option = document.createElement("option");
        option.text = result[i].title;
        option.value = result[i].title;
        moveElem.appendChild(option)
     }
            
        



}

bookmarkElem.addEventListener("click", (event) => {
    console.log(`Redirecting to ${url}`);
    chrome.tabs.create({ url: url });


});

moveElem.addEventListener("click", (event) => {

   console.log(event.target.value)

})
removeElem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(bookmark)
    chrome.bookmarks.remove((bookmark.id), () => {
        console.log("Removed the bookmark.");
        chrome.bookmarks.getChildren(folderIndex, (arr) => {

            console.log("Folder id is ", folderIndex)
            bookmarkArr = arr;
            console.log("Bookmarks array is ", bookmarkArr);
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
