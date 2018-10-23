chrome.runtime.onInstalled.addListener(function() {
	console.log(' background.js loaded');
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//console.log(xhttp.responseText);
		}
	};
	xhttp.open("GET", "https://stackoverflow.com/questions/9421933/cross-origin-xmlhttprequest-in-chrome-extensions", true);
	xhttp.send();
	
	
});