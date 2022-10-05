function getAllFolders() {

    let promise = chrome.bookmarks.getTree().then((node) => {
        let res = [];
        let result = [];
        let topFolders = node[0].children;

        for (let i = 0; i < topFolders.length; i++) {

            res.push(topFolders[i]);
            result.push(topFolders[i]);
        }
        let promise = getSubFolders(res);

        return promise.then((subresult) => { result = result.concat(subresult); return result });
    })
    return promise.then(result => result);

}

function getSubFolders(res) {
    let promises = [];
    res.forEach((folder) => {
        promises.push(
            chrome.bookmarks.getChildren(folder.id).then((arr) => {
                let result = []
                let a = arr.filter(node => node.hasOwnProperty("dateGroupModified"));
                a.forEach(ele => {

                    result.push(ele);
                });

                return result;
            }))
    });

    return Promise.all(promises).then(result => {
        let arr = [];
        for (let i = 0; i < result.length; i++) {
            arr = arr.concat(result[i]);


        }
        return arr;

    });
}
export { getAllFolders };