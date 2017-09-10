var arr = [];
var payload = $.get('http://localhost:3001/api/v1/ride', function(result) {
    console.log(result)
        arr=result['records'];
});
function applyfilter() {
    $.when(payload,arr).then(function() {
        console.log(arr,8)
            createtable(arr);
    });
}
applyfilter();

function createtable(data4) {
    $('#maintable').empty();
    if ($.fn.DataTable.isDataTable('#' + 'download')) {
        $('#' + 'download').DataTable().destroy();
    }
    var htmlap = '';
    var value1 = 0;
    var value2 = 0;
    var value3 = 0;
    var value4 = 0;
    var value5 = 0;
    var htmlap = ''
    for (var i in data4) {
            value1 = data4[i]['id'] ? data4[i]['id'] : 0;
            value2 = data4[i]['customer_id'] ? data4[i]['customer_id'] : 0;
            value3 = data4[i]['request_time_elapsed'] ? data4[i]['request_time_elapsed'] : 0;
            value4 = data4[i]['status'] ? data4[i]['status'] : 0;
            value5 = data4[i]['driver_id'] ? data4[i]['driver_id'] : 0;
            htmlap += '<tr><td><center>' + value1 + '</center></td><td><center>' + value2 + '</center></td><td><center>' + value3 + '</center></td><td><center>' + value4 + '</center></td><td><center>' + value5 + '</center></td></tr>';
        }
    $('#maintable').html(htmlap);
    
}