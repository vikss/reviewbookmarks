
let folderElem = document.getElementById("folders")
let bookmarkElem = document.getElementById("bookmark")
let removeElem = document.getElementById("remove")
let moveElem = document.getElementById("move")
let keepElem = document.getElementById("keep")
let bookmark;
let url;
chrome.bookmarks.getTree((node)=>{
chrome.storage.sync.get("folder",(data)=>{
 folderElem.innerText=data.folder;

});
chrome.storage.sync.get("index",(data)=>{
let bookmarkArr = node[0].children[data.index];
[bookmark] = bookmarkArr.children;
console.log(bookmark);
bookmarkElem.innerText = bookmark.title;
bookmarkElem.href = bookmark.url;

url = bookmark.url;

});


})
bookmarkElem.addEventListener("click",(event)=>{
console.log(`Redirecting to ${url}`);
chrome.tabs.create({url: url});

});
removeElem.addEventListener("click", (event)=>{
event.preventDefault();
console.log(bookmark)
chrome.bookmarks.remove((bookmark.id), ()=>{
    console.log("Removed ")})
})



moveElem.addEventListener("click",(event)=>{
event.preventDefault();

})
keepElem.addEventListener("click",(event)=>{
event.preventDefault();
console.log(bookmark)
})
