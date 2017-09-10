var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("id");
var jsonObj = {}
$("#checking").html("Driver App- Driver id:  " + c)
var waiting = []
var waiting1 = []
var waiting2 = []
var payload =  $.ajax({
        url: "http://localhost:3001/api/v1/ride?filters=status:Waiting",
        method: "GET",
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        contentType: "application/json",
         success: function(result,status,jqXHR ){
            waiting = result.records
         },
         error(jqXHR, textStatus, errorThrown){
             //Do something
              alert("Error")

         }
    }); 
var payload2 =  $.ajax({
        url: "http://localhost:3001/api/v1/ride?filters=driver_id:"+c+";status:Completed",
        method: "GET",
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        contentType: "application/json",
         success: function(result,status,jqXHR ){
            waiting2 = result.records
         },
         error(jqXHR, textStatus, errorThrown){
             //Do something
              alert("error")

         }
    }); 
var payload1 =  $.ajax({
        url: "http://localhost:3001/api/v1/driver/" +c,
        method: "GET",
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        contentType: "application/json",
         success: function(result,status,jqXHR ){
         	waiting1 = result
         },
         error(jqXHR, textStatus, errorThrown){
             //Do something
              alert("error")

         }
    }); 
applyfilter();
function applyfilter() {
    $.when(payload, payload1,payload2).then(function() {
            createtable(waiting, waiting1, waiting2 );
    });
}
function createtable(data1, data2, data3) {
	console.log(data1)
    var htmlap = '';
    var htmlap1 = '';
	var htmlap2 = '';
	for(var i in data1) {
		var value1 = data1[i]['id'] ? data1[i]['id']: '-'; 
		var value2 = data1[i]['customer_id'] ? data1[i]['customer_id']: '-'; 
		var value3 = data1[i]['request_time_elapsed'] ? data1[i]['request_time_elapsed']: '-'; 
		htmlap += '<tr><td>Request id: ' + value1 +'</td><td>Customer id: ' + value2 + '</td><td>Request time: ' +value3 +'</td><td><button id ='+value1+' onclick="serveride(id)"> Select</button>';
	}
    console.log(data3)
    if(data2.current_ride){
        htmlap1 += '<tr><td>Request id: ' + data2['current_ride']['id'] +'</td><td>Customer id: ' +  data2['current_ride']['customer_id'] + '</td><td>Request time: ' +data2['current_ride']['request_time_elapsed']  +'</td><td>Picked up time: ' +data2['current_ride']['pickup_time_elapsed']  +'</td>';
    }
    for(var i in data3) {
        var value1 = data3[i]['id'] ? data3[i]['id']: '-'; 
        var value2 = data3[i]['customer_id'] ? data3[i]['customer_id']: '-'; 
        var value3 = data3[i]['request_time_elapsed'] ? data3[i]['request_time_elapsed']: '-'; 
        var value4 = data3[i]['completed_time_elapsed'] ? data3[i]['completed_time_elapsed']: '-'; 
        var value5 = data3[i]['pickup_time_elapsed'] ? data3[i]['pickup_time_elapsed']: '-'; 
        htmlap2 += '<tr><td>Request id: ' + value1 +'</td><td>Customer id: ' + value2 + '</td><td>Request time: ' +value3 +'</td><td>Completed time: ' +value4 +'</td><td>Picked time elapsed: ' +value5 +'</td>';
    }
    $('#maintable').html(htmlap)
    $('#maintable1').html(htmlap1)
	$('#maintable2').html(htmlap2)
}
function serveride(id) {
	var obj = {"driver_id":c}
	$.ajax({
        url: "http://localhost:3001/api/v1/ride/"+id+"/serve",
        method: "PUT",
        data: JSON.stringify(obj),
        dataType: 'json',
        contentType: "application/json",
         success: function(result,status,jqXHR ){
         	alert("Successfully done")
            location.reload(true);
         },
         error(jqXHR, textStatus, errorThrown){
             //Do something
             console.log(textStatus, errorThrown,jqXHR)
            var json = JSON.parse(jqXHR.responseText) 
              alert(json.error.message)

         }
    }); 
}
function refreshfunction() {
 applyfilter();
}