'use strict';

let notifications = 0;

chrome.runtime.onInstalled.addListener(function() {

	console.log(' background.js loaded');
	
	// test save urls
	chrome.storage.local.set({"AmazonURLS": {"PIZZAPIE":45, "Stupid": "No"}});

	testSave({"wowza":"112.19"});

	chrome.storage.local.get({"AmazonURLS": {}}, function(data){
		console.log(data.AmazonURLS);
	});
	
	//reset badge text
	chrome.browserAction.setBadgeText({text: ""});

	// test scrape amazon page
	
	//scrapePage("https://www.amazon.com/dp/B07GHB4KG6/ref=sxts_kp_bs_tr_lp_1?pf_rd_m=ATVPDKIKX0DER&pf_rd_p=8778bc68-27e7-403f-8460-de48b6e788fb&pd_rd_wg=yX6Y2&pf_rd_r=J2X9QVBGM4D2ZNK6XC99&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pd_rd_i=B07GHB4KG6&pd_rd_w=6thB7&pf_rd_i=ak47&pd_rd_r=ac861a9a-c37c-4114-86c6-c132fc650836&ie=UTF8&qid=1540483753&sr=1")

	
	
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
				
				let price = htmlDoc.getElementById('priceblock_ourprice').innerHTML;
				console.log(price);
	
				// DO SOMETHING WITH THAT GIVEN PRICE HERE


				//console.log(price.trim());
				//console.log(htmlDoc.getElementsByClassName('gravatar-wrapper-32')[0].getElementsByTagName('img')[0].src);
				//console.log(xhttp.responseText);
			}
		};
	xhttp.open("GET", url, true);
	xhttp.send();
}


// example amazon urls for testing purposes
function testSave(test){
	// {"urlhere": "18.95"}
	// only one at a time for now

	chrome.storage.local.get({"AmazonURLS": {}}, function(data){
		console.log(Object.keys(data.AmazonURLS));
		// prevent duplication
		//!data.AmazonURLS.includes(test)


		if(!Object.keys(data.AmazonURLS).includes(Object.keys(test))){
			for(var key in test){
				console.log('SAVING ' + test);
				let value = test[key];
				
				let newData = data.AmazonURLS;
				
				// add the new value to data
				newData.key = value;

				chrome.storage.local.set({"AmazonURLS": newData});

			}
		}
		/*
		for (let i = 0; i < Object.keys(data.AmazonURLS).length; i++){
			if (!Object.keys(data.AmazonURLS[i]).includes(Object.keys(test))){
			
				// create new array to overwrite existing 
				let newUrls = data.AmazonURLS;

				// add unique url
				newUrls.push(test);
				chrome.storage.local.set({"AmazonURLS":newUrls});
			}
		}
		*/
		

	});
}







// Load saved urls
/*
function loadUrls(){
	chrome.storage.local.get({"AmazonURLS": []}, function(data){
		console.log(data.AmazonURLS.length);
		
		// loop through array
		for(let index = 0; index < data.AmazonURLS.length; index++){
			console.log(data.AmazonURLS[index]);
		}

	})
}
*/
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