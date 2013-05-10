var frontstage = $("#frontstage");

Main.statusbar = $("#status-bar").first();

//Go to backstage.
frontstage.find("a[href='#backstage']").on("show", function(e) {
    e.preventDefault();
    frontstage.fadeOut(300);
    backstage.slideDown(500);
});

{% include "ribbon/ribbon.js" %}

//Canvas operations.

Main.paper = Raphael("canvas-container", 0.9*screen.availWidth, 0.85*screen.availHeight);

Main.canvas = $(Main.paper.canvas);

//Add neuron, erase and connection functionality.
Main.canvas.on("click", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        switch(selected.id) {
            case "neuron":
                Main.Neuron.create(Main.paper, x, y);
                Main.statusbar.text("Neuron added.");
                break;
            case "eraser":
                var obj = Main.paper.getElementByPoint(e.clientX, e.clientY).data("parent");
                if (obj.type === "Neuron") {
                    Main.Neuron.destroy(obj);
                    Main.statusbar.text("Neuron #" + obj.code + " erased.");
                }
                else if (obj.type === "Connection") {
                    Main.Connection.destroy(obj);
                    Main.statusbar.text(Raphael.format("Connection between {0} and {1} erased.", obj.to, obj.from));
                }
                delete obj;
                break;
        }
    }
});

//Unselected all selected components.
Main.canvas.on("click", function(e) {
    if (Main.canvas[0] === e.target) {
        Main.Selection.clear();
    }
});

//<Add connection>
Main.canvas.on("mousedown", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected && selected.id == "connect") {
        var connection = Main.Connection.create(Main.paper, x, y);
        var obj = Main.paper.getElementByPoint(e.clientX, e.clientY).data("parent");
        Main.Connection.set(connection, "from", obj);        
        Main.toolbar.data("current-connection", connection);
    }
});


Main.canvas.on("mousemove", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected && selected.id == "connect") {
        var connection = Main.toolbar.data("current-connection");
        if (connection !== undefined) {
            Main.Connection.extendPathTo(connection, x, y);        }
    }
});

Main.canvas.on("mouseup", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected && selected.id == "connect") {
        var connection = Main.toolbar.data("current-connection");
        if (connection !== undefined) {
            Main.toolbar.removeData("current-connection");
            var elems = Main.paper.getElementsByPoint(x, y);
            for (var i = 0; i < elems.length; i++) {
                var obj = elems[i].data("parent");
                if (obj.type === "Neuron") {
                    Main.Connection.set(connection, "to", obj);
                    break;
                }
            }
        }
    }
});
//</Add connection>

{% include "forms/forms.js" %}