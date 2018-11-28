'use strict';

let notifications = 0;

chrome.runtime.onInstalled.addListener(function() {

	console.log(' background.js loaded');
	// test save urls
	/*
	chrome.storage.local.set({"AmazonURLS": {"https://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO/ref=zg_bs_electronics_home_3?_encoding=UTF8&psc=1&refRID=B2NH4HN9QXK5K1D9KW8C":"4.43"}}, function(data){
		loadUrls();
	});
	*/

	//saveNew({"https://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO/ref=zg_bs_electronics_home_3?_encoding=UTF8&psc=1&refRID=B2NH4HN9QXK5K1D9KW8C":""});

	//saveNew({"test":"34.2"})
	//reset badge text
	chrome.browserAction.setBadgeText({text: ""});

	// test scrape amazon page
	
	//scrapePage("https://www.amazon.com/dp/B07GHB4KG6/ref=sxts_kp_bs_tr_lp_1?pf_rd_m=ATVPDKIKX0DER&pf_rd_p=8778bc68-27e7-403f-8460-de48b6e788fb&pd_rd_wg=yX6Y2&pf_rd_r=J2X9QVBGM4D2ZNK6XC99&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pd_rd_i=B07GHB4KG6&pd_rd_w=6thB7&pf_rd_i=ak47&pd_rd_r=ac861a9a-c37c-4114-86c6-c132fc650836&ie=UTF8&qid=1540483753&sr=1")
	//scrapePage("https://www.amazon.com/Amazon-Echo-Dot-Portable-Bluetooth-Speaker-with-Alexa-Black/dp/B01DFKC2SO/ref=zg_bs_electronics_home_3?_encoding=UTF8&psc=1&refRID=B2NH4HN9QXK5K1D9KW8C");

	
});
// Notes:
// the id priceblock_ourprice outputs the main price of a page.  However this seems to vary for book listings which have multiple purchase options.  Maybe figure out how to test difference or just ignore books?


// Scrapes the price of an amazon price product when given a url
function scrapePage(url){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				
				// Parse using DOM Parser
				let parser = new DOMParser();
				let htmlDoc = parser.parseFromString(xhttp.responseText, "text/html");
				
				// For book listings there are multiple prices.
				//price = htmlDoc.getElementsByClassName('a-size-base a-color-price a-color-price')[0].innerHTML;
				let price = ""
				try {
					price = htmlDoc.getElementById('priceblock_ourprice').innerHTML;
				}
				catch(err) {
					price = htmlDoc.getElementById('priceblock_dealprice').innerHTML;
				}
				
				//remove any dollar signs ($) that may mess with parsing the string to a float.
				let formatPrice = price.replace("$", "");

				console.log(formatPrice);
				
				// save new price.
				saveNew({[url]:formatPrice});
				

				//console.log(price.trim());
				//console.log(htmlDoc.getElementsByClassName('gravatar-wrapper-32')[0].getElementsByTagName('img')[0].src);
				//console.log(xhttp.responseText);
			}
		};
	xhttp.open("GET", url, true);
	xhttp.send();
}


// example amazon urls for testing purposes
function saveNew(test){
	// {"urlhere": "18.95"}
	// only one at a time for now

	chrome.storage.local.get({"AmazonURLS": {}}, function(data){
		console.log(Object.keys(data.AmazonURLS));
		// prevent duplication
		//!data.AmazonURLS.includes(test)

		// save unique urls
		if(!Object.keys(test) in data.AmazonURLS){
			for(var key in test){
				let value = test[key];
				
				let newData = data.AmazonURLS;
			
				// add the new value to data
				newData[key] = value;
				chrome.storage.local.set({"AmazonURLS": newData});
				
			}
		} else {
			console.log("URL already stored.");
			for (let key in test){
				let tempPrice = test[key];
				console.log("Temp price is " + tempPrice);
				let tempUrl = key;
				console.log("Temp url is " + tempUrl);
				comparePrice(tempUrl, tempPrice);
			}
		}



		
		
		// comparePrice test
		//comparePrice("test", "6.04");

	});
}

// compares old amazon price with the new amazon price and then saves new price if it is lower.
function comparePrice(url, newPrice){

	chrome.storage.local.get({"AmazonURLS": {}}, function(data){
		// check if there is a saved price for that url
		//if(Object.keys(data.AmazonURLS).includes(url)){
		//console.log("This is " + url);
		//console.log("This is " + data.AmazonURLS[url]);
		if (url in data.AmazonURLS){
			// make saved price a float
			let oldPrice = data.AmazonURLS[url];
			console.log("The old price is " + oldPrice);
			if(newPrice < oldPrice){
				
				//update new price
				let newData = data.AmazonURLS;
				newData[url] = newPrice;

				//notification of new deal
				chrome.browserAction.setBadgeText({text: "!"});

				chrome.storage.local.set({ "AmazonURLS": newData });
				
				// Tell popup.html about this great new deal!
				//magic here
				
				// check that save worked
				chrome.storage.local.get({"AmazonURLS": {}}, function(data){
					console.log(data.AmazonURLS);
				});
				
				

			} else {
				console.log("no price change for " + url);
				//TESTING
				//loadUrls();
			}


		} else {
			console.log("There is no saved history of tracking " + url);
		}
	});

}






// Load saved urls

function loadUrls(){
	chrome.storage.local.get({"AmazonURLS": []}, function(data){
		let keyLength = Object.keys(data.AmazonURLS).length;
		console.log(data.AmazonURLS);
		// loop through array
		for(let key in data.AmazonURLS){
			// check price for each url
			scrapePage(key);
		}

	})
}




// GET THAT GOOD URL EYYY
chrome.extension.onConnect.addListener(function(port){
	console.log("CONNECTED TO MAIN FRAME.  EPIC CODE NOW PROCESSING.");

	port.onMessage.addListener(function(msg){
		if (msg == "TABURL"){

			// why do I do this .___.

			chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs){
				console.log(tabs[0].url);
			});



		}
	});

});












// ATTEMPT to get url of a given tab.  Duplication issue

/*
chrome.tabs.onUpdated.addListener(function(){
	getTabUrl();
});



function getTabUrl(){

	//get url of tab
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tabs){
		
		console.log(tabs[0].url);
		if (tabs[0].url.startsWith("https://www.amazon.com/gp/product/")){
			notifications += 1
			chrome.browserAction.setBadgeText({text: String(notifications)});

		}
	});
}
*/


	/* test get url from tab
	chrome.tabs.getCurrent(function(tab){
	console.log(tab.url);
	});
	*/