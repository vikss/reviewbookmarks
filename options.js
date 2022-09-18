let selectEle = document.getElementById("folders");
let option = document.createElement("button");
let form = document.getElementById("form");


function formOptions() {
    chrome.bookmarks.getTree((nodes) => {
        let folders = nodes[0].children;
        for (let i = 0; i < folders.length; i++) {
            let title = folders[i].title;
            let ele = document.createElement("option")
            ele.text = title;
            ele.value = title;
            selectEle.appendChild(ele);
        }

    })
}
form.addEventListener("submit", (e) => {

    e.preventDefault();

    let folder = document.forms["form"].folders.value;
    console.log(folder);
    chrome.storage.sync.set({ folder: folder });
    chrome.storage.sync.set({ bookmarkIndex: 0 })
    chrome.storage.sync.get("folder", (data) => {
        chrome.bookmarks.getTree((nodes) => {
            let childrenArray = nodes[0].children;
            let folderNode = childrenArray.find(c => {

                return c.title === data.folder
            });
            console.log(`Storing the bookmark folder id ${folderNode.id}.`);
            chrome.storage.sync.set({ folderId: folderNode.id });

        });


    })

})


formOptions();

