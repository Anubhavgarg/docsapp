$(".tablinks:first").addClass('active');
if($(".tablinks:first").attr("rel")){
    $($(".tablinks:first").attr("rel")).show();
}
else if($(".tablinks:first").attr("href")){
    $($(".tablinks:first").attr("href")).show();
}
$(".tablinks").click(function() {
    var which;
    if($(this).attr("rel")){
        which = $(this).attr("rel");
    }
    else if($(this).attr("href")){
        which = $(this).attr("href");
    }
    $(".tablinks").removeClass("active");
    $(this).addClass("active");
    $(".tabcontent").hide();
    $(which).show();
    $(which + " .tabnestlinks:first").addClass('active');
    if($(which + " .tabnestlinks:first").attr("rel")){
        $($(which + " .tabnestlinks:first").attr("rel")).show();
    }
    else if($(which + " .tabnestlinks:first").attr("href")){
        $($(which + " .tabnestlinks:first").attr("href")).show();
    }
    $(which + " .tabnestlinks").click(function() {
        var which;
        if($(this).attr("rel")){
            which = $(this).attr("rel");
        }
        else if($(this).attr("href")){
            which = $(this).attr("href");
        }
        $(which + " .tabnestlinks").removeClass("active");
        $(this).addClass("active");
        $(".tabnestcontent").hide();
        $(which).show();
    });
});
$(".tabnestlinks:first").addClass('active');
if($(".tabnestlinks:first").attr("rel")){
    $($(".tabnestlinks:first").attr("rel")).show();
}
else if($(".tabnestlinks:first").attr("href")){
    $($(".tabnestlinks:first").attr("href")).show();
}
$(".tabnestlinks").click(function() {
    var which;
    if($(this).attr("rel")){
        which = $(this).attr("rel");
    }
    else if($(this).attr("href")){
        which = $(this).attr("href");
    }
    $(".tabnestlinks").removeClass("active");
    $(this).addClass("active");
    $(".tabnestcontent").hide();
    $(which).show();
});
$(".tabnestlinks1:first").addClass('active');
if($(".tabnestlinks1:first").attr("rel")){
    $($(".tabnestlinks1:first").attr("rel")).show();
}
else if($(".tabnestlinks1:first").attr("href")){
    $($(".tabnestlinks1:first").attr("href")).show();
}
$(".tabnestlinks1").click(function() {
    var which;
    if($(this).attr("rel")){
        which = $(this).attr("rel");
    }
    else if($(this).attr("href")){
        which = $(this).attr("href");
    }
    $(".tabnestlinks1").removeClass("active");
    $(this).addClass("active");
    $(".tabnestcontent1").hide();
    $(which).show();
});