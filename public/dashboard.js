var arr = [];
var payload = $.get('http://api/v1/ride', function(result) {
    console.log(result)
    for (var i in result) {
        arr.push(result[i]['data']);
    }
});

function applyfilter() {
    $.when(payload).then(function() {
            createtable(data1);
    });
}

function createtable(data1) {
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
    for (var i in data1) {
            value1 += data4[i]['number_of_students'] ? data4[i]['number_of_students'] : 0;
            value2 += data4[i]['3rd_and_5th_sc_boys'] ? data4[i]['3rd_and_5th_sc_boys'] : 0;
            value3 += data4[i]['3rd_and_5th_st_boys'] ? data4[i]['3rd_and_5th_st_boys'] : 0;
            value4 += data4[i]['3rd_and_5th_obc_boys'] ? data4[i]['3rd_and_5th_obc_boys'] : 0;
            value5 += data4[i]['3rd_and_5th_general_boys'] ? data4[i]['3rd_and_5th_general_boys'] : 0;
            htmlap = '<tr><td><center>' + value1 + '</center></td><td><center>' + value2 + '</center></td><td><center>' + value3 + '</center></td><td><center>' + value4 + '</center></td><td><center>' + value5 + '</center></td></tr>';
        }
    $('#maintable').html(htmlap);
    var table1 = $("#download").DataTable({
        dom: 'Bfrtip',
        "bDestroy": true,
        "searching": false,
        "paging": true,
        buttons: [{
            extend: 'excelHtml5',
        }],
        "lengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ]
    });
}