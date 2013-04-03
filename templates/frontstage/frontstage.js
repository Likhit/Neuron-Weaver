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
Main.stage = new Kinetic.Stage({
        container: "canvas-container",
        width: 0.9*screen.availWidth,
        height: 0.85*screen.availHeight
    });

Main.layer = new Kinetic.Layer();

Main.stage.add(Main.layer);

Main.canvas = $(Main.layer.getCanvas().getElement());
    //Add neuron on click.
Main.canvas.on("click", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        switch(selected.id) {
            case "neuron":
                var neuron = new Main.Neuron();
                neuron.addToLayer(Main.layer, x, y);
                Main.statusbar.text("Neuron added.");
                break;
        }
    }
});

//<Add connection>
Main.canvas.on("mousedown", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        switch(selected.id) {
            case "connect":
                var connection = new Main.Connection();
                connection.addToLayer(Main.layer, x, y);
                Main.toolbar.data("current-connection", connection);
                var counter = 0;
                var interval = setInterval(function() {
                    connection.from = Main.toolbar.data("connect-from");
                    if (connection.from !== undefined || counter++ > 10) {
                        if (connection.from !== undefined) {
                            connection.setLineStroke("#a0a0a0");
                            Main.statusbar.text("Connection started from " + connection.from + ".");
                        }
                        Main.toolbar.removeData("connect-from");
                        clearInterval(interval);
                    }
                }, 200);
                break;
        }
    }
});

Main.canvas.on("mousemove", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        switch(selected.id) {
            case "connect":
                var connection = Main.toolbar.data("current-connection");
                if (connection !== undefined) {
                    connection.addPoint(x, y);
                }
                break;
        }
    }
});

Main.canvas.on("mouseup", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        switch(selected.id) {
            case "connect":
                var connection = Main.toolbar.data("current-connection");
                if (connection !== undefined) {
                    connection.addPoint(x, y);
                    Main.toolbar.removeData("current-connection");
                    var counter = 0;
                    var interval = setInterval(function() {
                        connection.to = Main.toolbar.data("connect-to");
                        if (connection.to !== undefined || counter++ > 10) {
                            if (connection.getLineStroke() === "#a0a0a0") {
                                connection.setLineStroke("black");
                                Main.statusbar.text("Connection created from " + connection.from + " to " + connection.to + ".");
                            }
                            Main.toolbar.removeData("connect-to");
                            clearInterval(interval);
                        }
                    }, 200);
                }
                break;
        }
    }
});
//</Add connection>

{% include "forms/forms.js" %}