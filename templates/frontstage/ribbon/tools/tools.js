Main.toolbar = $("#tools").first();

//Tool selection events.
Main.toolbar.find("#neuron, #eraser, #connect").on("click", function(e) {
    e.preventDefault();
    var selected = Main.toolbar.data("selected");
    if (selected !== e.currentTarget) {
        $(selected).removeClass("sel");
        Main.toolbar.data("selected", e.currentTarget);
        Main.canvas.css("cursor", "crosshair");
        Main.statusbar.text("Tool: " + e.currentTarget.id + " selected.");
    }
    else {
        Main.toolbar.removeData("selected");
        Main.canvas.css("cursor", "auto");
        Main.statusbar.text("Tool: " + e.currentTarget.id + " deselected.");
    }
    $(e.currentTarget).toggleClass("sel");
});

//Dismantle the network.
$("#build").on("show", function(e) {
    if (e.relatedTarget && e.relatedTarget.id === "run") {
        Main.ann.dismantle();
        delete Main.ann;
    }
});