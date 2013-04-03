var frontstage = $("#frontstage");

Main.statusbar = $("#status-bar").first();

//Go to backstage.
frontstage.find("a[href='#backstage']").on("show", function(e) {
    e.preventDefault();
    frontstage.fadeOut(300);
    backstage.slideDown(500);
});

$("#toggle-ribbon").on("show", function(e) {
    e.preventDefault();
    var target = $(e.target);
    var relatedTarget = $(e.relatedTarget);
    var ul = target.parents("ul");
    var tabContent = ul.parents(".ribbon").find(".tab-content");
    if (!ul.data("collapsed")) {
        tabContent.hide(200);
        setTimeout(function() {
            $(".page").addClass("collapsed-page");
        }, 190);
        target.find("i").removeClass("icon-chevron-up").addClass("icon-chevron-down");
        relatedTarget.parent().removeClass("active");
        ul.data("collapsed", true);
        ul.data("lastOpenTab", relatedTarget);
    }
    else {
        tabContent.show(200);
        setTimeout(function() {
            $(".page").removeClass("collapsed-page");
        }, 190);
        target.find("i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
        ul.removeData("collapsed");   
        ul.data("lastOpenTab").tab('show');
    }
});

frontstage.find("a[data-toggle='tab']:not(#toggle-ribbon, #help, [href='#backstage'])").on("show", function(e) {
    var target = $(e.target);
    var ul = target.parents("ul");
    var tabContent = ul.parents(".ribbon").find(".tab-content");
    if (ul.data("collapsed")) {
        tabContent.show(200);
        setTimeout(function() {
            $(".page").removeClass("collapsed-page");
        }, 190);
        ul.find("#toggle-ribbon i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
        ul.removeData("collapsed");
    }
});

$("#help").on("show", function(e) {
    e.preventDefault();
    frontstage.find("a[href='#backstage']").tab("show");
    backstage.find("a[href='#help-tab']").tab("show");
});