// Loads saved urls
window.onload = function(){

    //var table = Document.createElement('p');

    chrome.storage.local.get({"AmazonURLS": []}, function(data){
        for ( let i in Object.keys(data.AmazonURLS) ){
            let url = Object.keys(data.AmazonURLS)[i];
            let price = data.AmazonURLS[Object.keys(data.AmazonURLS)[i]];
            
            
            // regex recipe:
            var findName = /(?<=www.amazon.com\/)\w*/

            let name = url.match(findName);
            //console.log(name[0]);
            let newHTML = "<tbody> " + "<tr><td><a href=" + url + " target='_blank'>" + String(name) + "</a></td>" + "<td>" + String(price) + "</td><td class='del'>X</td></tr></tbody>";
            let listing = document.getElementById('table').innerHTML += newHTML;

            //listing.addEventListener('onclick', function(){
            //    chrome.tabs.create(url);
            //});

            //console.log(newHTML);        
        }

        //add event listeners to delete them! :D

        // TO-DO: Add functionality so the user can delete listings.

        let listRows = document.getElementsByClassName('del');
        for (let entry; entry < listRows.length; entry++){
            console.log(entry);
            //document.getElementsByClassName('del')[entry].addEventListener('click', function(){
            //    console.log('clicked!');
            //});
        }
        


    });

}