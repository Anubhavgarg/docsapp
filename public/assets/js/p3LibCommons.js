ACCESS_TOKEN='ZD0env8r41R4qeDvhYmdkT6GxYL2fYBcmFgjMMrMFBoW2pc1ZlMBPAi76O864PoD';

function pradyPostFunction(path, params, method) {
	method = method || "post"; // Set method to post by default if not specified.

	// The rest of this code assumes you are not using a library.
	// It can be made less wordy if you use one.
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);

	for(var key in params) {
		if(params.hasOwnProperty(key)) {
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", key);
			hiddenField.setAttribute("value", params[key]);

			form.appendChild(hiddenField);
		}
	}

	document.body.appendChild(form);
	form.submit();
}

// Returns an object withs keys as the tagElement IDs and the values as tagElementNames.
var getTagElementMap = function(programId) {
	var mapObj = {};
	$.ajax({
		url:'https://api.p3fy.com/api/programs?filter={"include":{"tags":"tagElements"},"where":{"id":'+programId+'}}&access_token='+ACCESS_TOKEN,
		method : 'GET',
		dataType : 'json',
		async : false,
		success : function(result) {
			for(var i = 0; i < result[0]["tags"].length; i++)
			{
				for(var j = 0; j < (result[0]["tags"][i]["tagElements"]).length; j++) {
					if(mapObj.hasOwnProperty(result[0]["tags"][i]["tagElements"][j]["id"])) {
					}
					else
					{
						mapObj[result[0]["tags"][i]["tagElements"][j]["id"]] = result[0]["tags"][i]["tagElements"][j]["name"];
					}
				}
			}
		},
		error : function() {
			console.log("Error in getTagElementMap function.");
		}
	})
	return mapObj;
}
function getProjectNameMap(programId)
{
	var mapObj={};
	$.ajax({
		url:'https://api.p3fy.com/api/projects?filter={"where":{"programId":'+programId+'}}&access_token='+ACCESS_TOKEN,
		method:'GET',
		dataType:'json',
		async:false,
		success:function(result){
			for(var i=0;i<result.length;i++)
			{
				if(mapObj.hasOwnProperty[result[i]["id"]])
				{

				}
				else
				{
					mapObj[result[i]["id"]]=result[i]["name"];
				}
			}
		},
		error:function(){
			console.log("Error in getProjectNameMap function.");
		}
	});
	return mapObj;
}

function getProfileData(query,async)
{
	var async = false;
	var mapObj=[];
	$.ajax({
		url:'https://api.p3fy.com/api/analytics/table?q=' + JSON.stringify(query),
		method:'GET',
		dataType:'json',
		async:async,
		success:function(result) {
			mapObj = result.data;
		},
		error:function(){
			console.log("Error in getting profileData");
		}
	});
	return mapObj;
}
function getLastModifiedProfile(profileIds)
{
	var mapObj=[];
	$.ajax({
		url:'https://api.p3fy.com/api/profileInstances?filter={"fields":{"modified":true},"where":{"profileId":{"inq":[' + profileIds + ']}},"order":"modified DESC","limit":1}&access_token='+ACCESS_TOKEN,
		method:'GET',
		dataType:'json',
		async:false,
		success:function(result) {
			mapObj = result[0].modified;
		},
		error:function(){
			console.log("Error in getting getLastModifiedProfile");
		}
	});
	return mapObj;
}
function parseURLParams(url)
{
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;
    if (query === url || query === "")
    {
        return;
    }
    for (i = 0; i < pairs.length; i++)
    {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);
        if (!parms.hasOwnProperty(n))
        {
            parms[n] = [];
        }
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
function getProfileInstanceData(profileId)
{
	var mapObj=[];
	$.ajax({
		url:'https://api.p3fy.com/api/profileInstances?filter={"fields":{"data":true},"where":{"profileId":'+profileId+'}}&access_token='+ACCESS_TOKEN,
		method:'GET',
		dataType:'json',
		async:false,
		success:function(result) {
			mapObj = result;
		},
		error:function(){
			console.log("Error in getting getProfileInstanceData");
		}
	});
	return mapObj;
}
function getProfileInstances(profileId)
{
    var mapObj=[];
    $.ajax({
        url:'https://api.p3fy.com/api/profileInstances?filter={"where":{"profileId":'+profileId+'}}&access_token='+ACCESS_TOKEN,
        method:'GET',
        dataType:'json',
        async:false,
        success:function(result) {
            mapObj = result;
        },
        error:function(){
            console.log("Error in getting getProfileInstanceData");
        }
    });
    return mapObj;
}
function changeToCurrency(number)
{
	number = number.toString();
	var afterPoint = '';
	if(number.indexOf('.') > 0)
	   afterPoint = number.substring(number.indexOf('.'),number.length);
	number = Math.floor(number);
	number = number.toString();
	var lastThree = number.substring(number.length-3);
	var otherNumbers = number.substring(0,number.length-3);
	if(otherNumbers != '')
	    lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	return res;
}
function createDonutChart(id, dataArray, colorArray)
{
	var chart1 = c3.generate({
	    bindto: '#' + id,
	    data: {
	        columns: dataArray,
	        type: 'donut'
	    },
	    tooltip: {
	        format: {
	            value: function(value, ratio, id, index) {
	                return value;
	            }
	        }
	    },
	    color:
	    {
	        pattern: colorArray
	    }
	});
	return chart1;
}
function createBarChart(id, dataArray, colorArray, categoryArray)
{
	var chart1 = c3.generate({
	    bindto: '#' + id,
	    data: {
	        columns: dataArray,
	        type: 'bar'
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: categoryArray
	        },
	    },
	    color:
	    {
	        pattern: colorArray
	    }
	});
	return chart1;
}
function getFinancialYearFromDate(date)
{
	var quarterObj = moment(date).fquarter();
	var finYear = quarterObj.year + '-' + quarterObj.nextYear;
	return finYear;
}
function makeModalsPics(modalId, title, picUrl) {
	return 	'<div id="' + modalId + '" class="modal fade">'+
	        	'<div class="modal-dialog modal-lg document-modal">'+
	          		'<div class="modal-content document-modal">'+
	            		'<div class="modal-header document-modal-header">' +
	                      	'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
	                      	'<h4 class="modal-title header-title">' + title + '</h4>' +
	                  	'</div>' +
	                  	'<div class="modal-body document-modal-body" style="text-align: center;max-height: 300px;">'+
	                    	'<img src ="' + picUrl + '" style="max-width:300px;max-height: 300px;padding: 10px;">'+
	                  	'</div>'+
	              	'</div>'+
	          	'</div>'+
	      	'</div>';
}
function makeModalsDocs(modalId, title, docUrl) {
  return 	'<div id="' + modalId + '" class="modal fade">'+
	        	'<div class="modal-dialog modal-lg document-modal">'+
	          		'<div class="modal-content document-modal">'+
	            		'<div class="modal-header document-modal-header">' +
	                      	'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
	                      	'<h4 class="modal-title header-title">' + title + '</h4>' +
	                  	'</div>' +
	                  	'<div class="modal-body document-modal-body">'+
                        	'<object data="' + docUrl + '" type="application/pdf" width="100%" height="100%"></object>'+
                      	'</div>'+
	              	'</div>'+
	          	'</div>'+
	      	'</div>';
}
function createMap(data,id,keyword)
{
	var marker1 = new L.MarkerClusterGroup();
    L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpcmFuZ3IiLCJhIjoiZDkwZmQyZWU2ZjczMjc4NDY3MjlhMzJjMDlmZWJlNDEifQ.KOGxA_ldJ-AQNd1LE_OwQA';
    var map = L.mapbox.map(id, 'mapbox.streets').setView([12.9067, 77.6757], 5);
    var myLayer = L.mapbox.featureLayer().addTo(map);
    var myIcon = L.icon({
        iconUrl :"http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png",
        iconSize : [40, 40],
        iconAnchor : [20, 40]
    })
    $('.leaflet-popup-content').css("width", "auto !important");
    for(var i in data) {

        if(data[i].submissionLong && data[i].submissionLat) {
            var marker = L.marker(new L.LatLng(data[i].submissionLat, data[i].submissionLong), {
                icon: myIcon
            });
            marker.bindPopup('<img src="'+data[i].photo+'" height="150px" width="150px" alt="No Image Available"/>');
            map.addLayer(marker);

        }
    }
    return map;
}
function makeSlickGallery(classId, isDBData, profileInfo, data, galleryOptions)
{
    if(classId != undefined && isDBData != undefined)
    {
        var defaultOptions = {
            lazyLoad: 'progressive',
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            adaptiveHeight: false,
            slidesToShow: 1
        };
        if(galleryOptions != undefined && galleryOptions != null && !($.isEmptyObject(galleryOptions)))
        {
            for(var i in galleryOptions)
            {
                for(var j in defaultOptions)
                {
                    if(i == j)
                    {
                        defaultOptions[i] = galleryOptions[j];
                    }
                    else
                    {
                        defaultOptions[j] = galleryOptions[j];
                    }
                }
            }
        }
        if(!isDBData)
        {
            if(data != undefined && Array.isArray(data))
            {
                for(var i in data)
                {
                    if(data[i].image != undefined)
                    {
                        var dataHeader = '';
                        var dataDesc = '';
                        if(data[i].header != undefined)
                        {
                            dataHeader = data[i].header;
                        }
                        if(data[i].desc != undefined)
                        {
                            dataDesc = data[i].desc;
                        }
                        $('.' + classId).append('<div style="position: relative;"><center><img src="../Uplon-v1.4/assets/plugins/slick-1.6.0/slick/ajax-loader.gif" data-lazy="' + data[i].image + '"><div class="slick-img-content"><h4 class="header-title" style="margin-bottom: 0px">' + dataHeader + '</h4><p>' + dataDesc + '</p></div></center></div>');
                    }
                }
            }
        }
        else
        {
            if(isDBData)
            {
                if(profileInfo != undefined)
                {

                }
            }
        }
        $('.' + classId).slick(defaultOptions);
    }
}
var ErrorLog = {
    showLogs: true,
    print: function(message)
    {
        if(!this.showLogs)
        {
            return 0;
        }
        var tempArr = new Error().stack.split("\n").slice(2);
        tempArr.unshift(message);
        console.error(tempArr.join("\n"));
    }
}

function createLastModifiedElement(elementId, inputMap, format)
{
    if(elementId != undefined && elementId != "")
    {
        if(inputMap != undefined)
        {
            if(inputMap === Object(inputMap))
            {
                var lastModifiedDate = getLastModifiedDate(inputMap);
                if(lastModifiedDate != undefined)
                {
                    var tempDate = moment(lastModifiedDate);
                    var dateFormat = "ddd MMM DD YYYY";
                    if(format != undefined)
                    {
                        dateFormat = format;
                    }
                    var finalModifiedDate = tempDate.format(dateFormat);
                    $("#" + elementId).html(finalModifiedDate);
                }
                else
                {
                    ErrorLog.print("No data returned for last modified date");
                }
            }
            else
            {
                ErrorLog.print("Entered input is not an Object");
            }
        }
        else
        {
            ErrorLog.print("No input provided for getting date");
        }
    }
    else
    {
        ErrorLog.print("Please provide HTML element id");
    }
}

function getLastModifiedDate(inputMap)
{
    var queryParams = "";
    var profileArray = [];
    var date;
    if(inputMap != undefined)
    {
        if(inputMap.program != undefined)
        {
            var programQuery = "";
            if(Array.isArray(inputMap.program))
            {
                programQuery = '{"where":{"programId":{"inq":[' + inputMap.program + ']}},"fields":["id"]}';
            }
            else
            {
                programQuery = '{"where":{"programId":' + inputMap.program + '},"fields":["id"]}';
            }
            $.ajax({
                url:'https://api.p3fy.com/api/profiles?filter=' + programQuery + '&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    for(var i in result)
                    {
                        profileArray.push(result[i].id);
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting profiles: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
        else if(inputMap.profiles != undefined)
        {
            if(Array.isArray(inputMap.profiles))
            {
                profileArray = inputMap.profiles;
            }
            else
            {
                profileArray.push(inputMap.profiles);
            }
        }
        else
        {
            ErrorLog.print("Neither Program nor Profile has been provided");
        }
        if(profileArray.length > 0)
        {
            $.ajax({
                url:'https://api.p3fy.com/api/profileInstances?filter={"fields":{"modified":true},"where":{"profileId":{"inq":[' + profileArray + ']}},"order":"modified DESC","limit":1}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    if(result[0] != undefined && result[0].modified != undefined)
                    {
                        date = result[0].modified;
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting LastModifiedDate from profiles: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
    }
    return date;
}

function getTagNameMap(programId)
{
    var tagNameMap = {};
    try
    {
        if(programId != undefined && Number.isInteger(programId))
        {
            $.ajax({
                url:'https://api.p3fy.com/api/tags?filter={"where":{"programId":' + programId + '},"fields":["id"],"include":{"relation":"tagElements","scope":{"fields":["id","name"]}}}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    for(var i in result)
                    {
                        if(result[i]["tagElements"] != undefined)
                        {
                            for(var j in result[i]["tagElements"])
                            {
                                tagNameMap[result[i]["tagElements"][j]["id"]] = result[i]["tagElements"][j]["name"];
                            }
                        }
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting Tag Names: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
        else
        {
            ErrorLog.print("Program Id not provided or is not a number: " + programId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Tag Names: " + error);
    }
    return tagNameMap;
}

function getSpecificTagData(tagId)
{
    var tagDataObj = {};
    try
    {
        if(tagId != undefined && Number.isInteger(tagId))
        {
            $.ajax({
                url:'https://api.p3fy.com/api/tagElements?filter={"where":{"tagId":' + tagId + '},"fields":["name","id","parent"]}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    for(var i in result)
                    {
                        tagDataObj[result[i]["id"]] = {};
                        tagDataObj[result[i]["id"]]["name"] = result[i]["name"];
                        tagDataObj[result[i]["id"]]["parent"] = result[i]["parent"];
                        tagDataObj[result[i]["id"]]["child"] = [];
                    }

                    for(var i in result)
                    {
                        for(var j in tagDataObj)
                        {
                            if(result[i]["parent"] == j)
                            {
                                tagDataObj[j]["child"].push(result[i]["id"]);
                            }
                        }
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting TagElements: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
        else
        {
            ErrorLog.print("TagId not provided or is not a number: " + tagId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Tag Hierarchy data: " + error);
    }
    return tagDataObj;
}

function getProjectMap(programId)
{
    var projectMap = {};
    try
    {
        if(programId != undefined && Number.isInteger(programId))
        {
            $.ajax({
                url:'https://api.p3fy.com/api/projects?filter={"where":{"programId":' + programId + '},"fields":["name","id","parent","code"]}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    for(var i in result)
                    {
                        projectMap[result[i]["id"]] = {};
                        projectMap[result[i]["id"]]["name"] = result[i]["name"];
                        projectMap[result[i]["id"]]["code"] = result[i]["code"];
                        projectMap[result[i]["id"]]["parent"] = result[i]["parent"];
                        projectMap[result[i]["id"]]["child"] = [];
                    }

                    for(var i in result)
                    {
                        for(var j in projectMap)
                        {
                            if(result[i]["parent"] == j)
                            {
                                projectMap[j]["child"].push(result[i]["id"]);
                            }
                        }
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting Projects: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
        else
        {
            ErrorLog.print("ProgramId not provided or is not a number: " + programId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Project Hierarchy data: " + error);
    }
    return projectMap;
}
function getQuestionKeywordMap(programId)
{
    var questionMap = {};
    try
    {
        if(programId != undefined && Number.isInteger(programId))
        {
            $.ajax({
                url:'https://api.p3fy.com/api/programs?filter={"where":{"id":' + programId + '},"fields":["id"],"include":{"relation":"profiles","scope":{"fields":["id"],"include":{"relation":"sections","scope":{"fields":["id"],"include":{"relation":"questions","scope":{"fields":["id","keyword"]}}}}}}}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) {
                    for(var i in result[0]["profiles"])
                    {
                        var sections = result[0]["profiles"][i]["sections"];
                        for(var j in sections)
                        {
                            var questions = sections[j]["questions"];
                            for(var k in questions)
                            {
                                questionMap[questions[k]["id"]] = questions[k]["keyword"];
                            }
                        }
                    }
                },
                error:function(xhr, status, error){
                    ErrorLog.print("Error in getting Questions: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                }
            });
        }
        else
        {
            ErrorLog.print("ProgramId not provided or is not a number: " + programId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Question - Keyword Mapping: " + error);
    }
    return questionMap;
}
function getProjectMapAsync(programId)
{
    var obj;
    try
    {
        if(programId != undefined && Number.isInteger(programId))
        {
            obj = $.ajax({
                url:'https://api.p3fy.com/api/projects?filter={"where":{"programId":' + programId + '},"fields":["name","id","parent","code"]}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:true,
                // success:function(result) {
                //     //Do Nothing
                // },
                // error:function(xhr, status, error){
                //     ErrorLog.print("Error in getting Projects: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                // }
            });
        }
        else
        {
            ErrorLog.print("ProgramId not provided or is not a number: " + programId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Project Hierarchy data: " + error);
    }
    return obj;
}
function getSpecificTagDataAsync(tagId)
{
    var obj;
    try
    {
        if(tagId != undefined && Number.isInteger(tagId))
        {
            obj = $.ajax({
                url:'https://api.p3fy.com/api/tagElements?filter={"where":{"tagId":' + tagId + '},"fields":["name","id","parent"]}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:true,
                // success:function(result) {
                //     //Do Nothing
                // },
                // error:function(xhr, status, error){
                //     ErrorLog.print("Error in getting TagElements: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                // }
            });
        }
        else
        {
            ErrorLog.print("TagId not provided or is not a number: " + tagId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Tag Hierarchy data: " + error);
    }
    return obj;
}
function getTagNameMapAsync(programId)
{
    var obj;
    try
    {
        if(programId != undefined && Number.isInteger(programId))
        {
            obj = $.ajax({
                url:'https://api.p3fy.com/api/tags?filter={"where":{"programId":' + programId + '},"fields":["id"],"include":{"relation":"tagElements","scope":{"fields":["id","name"]}}}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:true,
                // success:function(result) {
                //     //Do Nothing
                // },
                // error:function(xhr, status, error){
                //     ErrorLog.print("Error in getting Tag Names: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                // }
            });
        }
        else
        {
            ErrorLog.print("Program Id not provided or is not a number: " + programId);
        }
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Tag Names: " + error);
    }
    return obj;
}
function createTagMap(result)
{
    var tagNameMap = {};
    for(var i in result)
    {
        if(result[i]["tagElements"] != undefined)
        {
            for(var j in result[i]["tagElements"])
            {
                tagNameMap[result[i]["tagElements"][j]["id"]] = result[i]["tagElements"][j]["name"];
            }
        }
    }
    return tagNameMap;
}
function createSpecificTagMap(result)
{
    var tagDataObj = {};
    for(var i in result)
    {
        tagDataObj[result[i]["id"]] = {};
        tagDataObj[result[i]["id"]]["name"] = result[i]["name"];
        tagDataObj[result[i]["id"]]["parent"] = result[i]["parent"];
        tagDataObj[result[i]["id"]]["child"] = [];
    }
    for(var i in result)
    {
        for(var j in tagDataObj)
        {
            if(result[i]["parent"] == j)
            {
                tagDataObj[j]["child"].push(result[i]["id"]);
            }
        }
    }
    return tagDataObj;
}
function createProjectMap(result)
{
    var projectMap = {};
    for(var i in result)
    {
        projectMap[result[i]["id"]] = {};
        projectMap[result[i]["id"]]["name"] = result[i]["name"];
        projectMap[result[i]["id"]]["code"] = result[i]["code"];
        projectMap[result[i]["id"]]["parent"] = result[i]["parent"];
        projectMap[result[i]["id"]]["child"] = [];
    }
    for(var i in result)
    {
        for(var j in projectMap)
        {
            if(result[i]["parent"] == j)
            {
                projectMap[j]["child"].push(result[i]["id"]);
            }
        }
    }
    return projectMap;
}
