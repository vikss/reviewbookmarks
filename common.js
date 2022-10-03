function getAllFolders() {

    chrome.bookmarks.getTree((node) => {
        let res = [];
        let result =[];
        let topFolders = node[0].children;

        for (let i = 0; i < topFolders.length; i++) {

            res.push(topFolders[i]);
            result.push(topFolders[i]);
        }
        res.forEach((folder) => {
            chrome.bookmarks.getChildren(folder.id, (arr) => {
                let a = arr.filter(node => node.hasOwnProperty("dateGroupModified"));
                a.forEach(ele => {

                    result.push(ele);
                });


            });
        })
    return result;

    });

}
export { getAllFolders };