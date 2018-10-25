chrome.runtime.onInstalled.addListener(function() {
	console.log(' background.js loaded');
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			// Parse using DOM Parser
			parser = new DOMParser();
			htmlDoc = parser.parseFromString(xhttp.responseText, "text/html");
			// For book listings there are multiple prices.
			//price = htmlDoc.getElementsByClassName('a-size-base a-color-price a-color-price')[0].innerHTML;
			price = htmlDoc.getElementById('priceblock_ourprice').innerHTML;
			console.log(price);
			//console.log(price.trim());
			//console.log(htmlDoc.getElementsByClassName('gravatar-wrapper-32')[0].getElementsByTagName('img')[0].src);
			//console.log(xhttp.responseText);
		}
	};
	xhttp.open("GET", "https://www.amazon.com/dp/B07GHB4KG6/ref=sxts_kp_bs_tr_lp_1?pf_rd_m=ATVPDKIKX0DER&pf_rd_p=8778bc68-27e7-403f-8460-de48b6e788fb&pd_rd_wg=yX6Y2&pf_rd_r=J2X9QVBGM4D2ZNK6XC99&pf_rd_s=desktop-sx-top-slot&pf_rd_t=301&pd_rd_i=B07GHB4KG6&pd_rd_w=6thB7&pf_rd_i=ak47&pd_rd_r=ac861a9a-c37c-4114-86c6-c132fc650836&ie=UTF8&qid=1540483753&sr=1", true);
	xhttp.send();
	
	
});
// Notes:
// the id priceblock_ourprice outputs the main price of a page.  However this seems to vary for book listings which have multiple purchase options.  Maybe figure out how to test difference or just ignore books?
