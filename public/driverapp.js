var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("id");
$("#checking").html("Driver App- Driver id:  " + c)

function refreshfunction() {
	
}