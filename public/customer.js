
function bookingserved() {
var id = document.getElementById("custid").value;
console.log(id)
jsonObj = {"customer_id":id}
$.ajax({
        url: "http://localhost:3001/api/v1/ride",
        method: "POST",
        data: JSON.stringify(jsonObj),
        dataType: 'json',
        contentType: "application/json",
         success: function(result,status,jqXHR ){
              alert("Ride created");
              location.reload(true);
         },
         error(jqXHR, textStatus, errorThrown){
             //Do something
              alert("Ride error")

         }
    }); 
}