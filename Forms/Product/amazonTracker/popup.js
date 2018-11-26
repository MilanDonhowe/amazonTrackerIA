'use strict';

window.onload = function(){

    // attach functions to buttons on HTML
    loadListen = document.getElementById("load").addEventListener('click', loadUrls);
    saveListen = document.getElementById("save").addEventListener('click', savePage);
       

}


let loadUrls = () => {
    // load saved urls and iterate through them
    console.log("loadUrls called");
}

let savePage = () => {
    // get the current page, check if amazon product and if price is extractable.
    console.log("savePage called");
}