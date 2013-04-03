var backstage = $("#backstage").hide();
//Go to frontstage.
backstage.find("a[href='#frontstage']").on("show", function(e) {
    e.preventDefault();
    backstage.slideUp(300);
    frontstage.fadeIn(500);
});