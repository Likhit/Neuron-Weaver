(function() {
    var buildBar = $("#tools").first();

    //Tool selection events.
    buildBar.find("#neuron, #eraser, #connect").on("click", function(e) {
        var selected = buildBar.data("selected");
        if (selected !== e.currentTarget) {
            $(selected).removeClass("selected");
            buildBar.data("selected", e.currentTarget);
            Main.canvas.data("current-tool", e.currentTarget.id);
            Main.canvas.css("cursor", "crosshair");
        }
        else {
            buildBar.removeData("selected");
            Main.canvas.removeData("current-tool");
            Main.canvas.css("cursor", "auto");
        }
        $(e.currentTarget).toggleClass("selected");
    });
})();

//Add neuron, erase and connection functionality.
Main.canvas.on("click", function(e) {
    var box = e.target.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var currentTool = Main.canvas.data("current-tool");
    switch(currentTool) {
        case "neuron":
            var neuron = new Main.Neuron(Main.paper, x, y);
            break;
        case "eraser":
            var obj = Main.paper.getElementByPoint(e.clientX, e.clientY).data("parent");
            obj.destroy();
            delete obj;
            break;
    }
});

//Unselected all selected components.
Main.canvas.on("click", function(e) {
    if (Main.canvas[0] === e.target) {
        Main.Selection.clear();
        if (!Main.neuronSettingsForm.hasClass("hide")) {
            Main.neuronSettingsForm.addClass("hide");
        }
        if (!Main.connectionSettingsForm.hasClass("hide")) {
            Main.connectionSettingsForm.addClass("hide");
        }
        if (!Main.globalSettingsForm.hasClass("hide")) {
            Main.globalSettingsForm.addClass("hide");
        }
    }
});

//<Add connection>
Main.canvas.on("mousedown", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var currentTool = Main.canvas.data("current-tool");
    if (currentTool == "connect") {
        var connection = new Main.Connection(Main.paper, x, y);
        var obj = Main.paper.getElementByPoint(e.clientX, e.clientY).data("parent");
        connection.set("from", obj);        
        Main.canvas.data("current-connection", connection);
    }
});


Main.canvas.on("mousemove", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var currentTool = Main.canvas.data("current-tool");
    if (currentTool == "connect") {
        var connection = Main.canvas.data("current-connection");
        if (connection !== undefined) {
            connection.extendPathTo(x, y);
        }
    }
});

Main.canvas.on("mouseup", function(e) {
    var box = Main.canvas[0].getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    var currentTool = Main.canvas.data("current-tool");
    if (currentTool == "connect") {
        var connection = Main.canvas.data("current-connection");
        if (connection !== undefined) {
            Main.canvas.removeData("current-connection");
            var elems = Main.paper.getElementsByPoint(x, y);
            for (var i = 0; i < elems.length; i++) {
                var obj = elems[i].data("parent");
                if (obj.type === "Neuron") {
                    connection.set("to", obj);
                    break;
                }
            }
        }
    }
});
//</Add connection>