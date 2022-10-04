import { getAllFolders } from './common.js';

let form = document.getElementById("form");


function formOptions() {
    let selectEle = document.getElementById("folders");
    getAllFolders().then((data) => {

        let folders = data;
        console.log(folders);
        for (let i = 0; i < folders.length; i++) {
            let title = folders[i].title;
            let ele = document.createElement("option")
            ele.text = title;
            ele.value = title;
            selectEle.appendChild(ele);
        }


    });


}
form.addEventListener("submit", (e) => {

    e.preventDefault();

    let folder = document.forms["form"].folders.value;
    console.log(folder);
    chrome.storage.sync.set({ folder: folder });
    chrome.storage.sync.set({ bookmarkIndex: 0 })
    getAllFolders().then((folders) => {
        let newFolder = folders.find(folderObj => 
            folderObj.title == folder
        );
        console.log(`Storing the bookmark folder id ${newFolder.id}.`);
        chrome.storage.sync.set({ folderId: newFolder.id });


    })

})

formOptions();


