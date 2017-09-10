ACCESS_TOKEN='ZD0env8r41R4qeDvhYmdkT6GxYL2fYBcmFgjMMrMFBoW2pc1ZlMBPAi76O864PoD';
/***************************************************************************************************
* This function is used for making gallery based on Slick Carousel.
* -> "classId" and "isDBData" are necessary for the function to work.
* -> "classId" is the class of the div where the gallery has to be displayed.
* -> "isDBData" is a boolean value which tells if the data has to be fetched
*    from DB or is provided in the "data" keyword.
* -> "data" keyword accetps an array of objects with object structure as:
*    {"image":actualUrlofImage(required),"header":imageHeading(optional),"desc":imageDesc(optional)}
* -> "galleryOptions" is an object which contains the customizable properties
*    of Slick Carousel.
****************************************************************************************************/
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
function getProfileDataforGallery(profileInfo)
{
    
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
                url:'https://api.p3fy.com/api/projects?filter={"where":{"programId":' + programId + '},"fields":["name","id","parent"]}&access_token=' + ACCESS_TOKEN,
                method:'GET',
                dataType:'json',
                async:false,
                success:function(result) { 
                    for(var i in result)
                    {
                        projectMap[result[i]["id"]] = {};
                        projectMap[result[i]["id"]]["name"] = result[i]["name"];
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