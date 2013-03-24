Main = {};
$(function() { 
    Main.toolbar = $("#tools").first();
    Main.weightSetter = $("#set-weight").first();
    Main.thresholdSetter = $("#set-threshold").first();
    Main.stage = new Kinetic.Stage({
        container: "canvas-container",
        width: 1273,
        height: 622
    });
    Main.layer = new Kinetic.Layer();
    Main.layer.setClearBeforeDraw(true);
    Main.canvas = $(Main.layer.getCanvas().getElement());
    
    Main.stage.add(Main.layer);
    //Tool selection events.
    Main.toolbar.find("#neuron, #eraser, #connect").on("click", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected !== e.target) {
            Main.toolbar.data("selected", e.target);
            Main.canvas.css("cursor", "crosshair");
            Main.layer.get(".neuron").apply("setDraggable", false);
        }
        else {
            Main.toolbar.removeData("selected");
            Main.canvas.css("cursor", "auto");
            Main.layer.get(".neuron").apply("setDraggable", true);
        } 
    });

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

    //Show threshold setting form. 
    Main.thresholdSetter.find("button").on("click", function(e) {
        e.preventDefault();
        var neuron = Main.thresholdSetter.data("current-neuron");
        neuron.threshold = parseFloat(Main.thresholdSetter.find("input").val(), 10);
        Main.thresholdSetter.removeData("current-neuron");
        Main.thresholdSetter.addClass("hidden");
    });

    Main.thresholdSetter.find("input").on("focusout", function(e) {
        Main.thresholdSetter.addClass("hidden");
    });

    //Show weight setting form.
    Main.weightSetter.find("button").on("click", function(e) {
        e.preventDefault();
        var connection = Main.weightSetter.data("current-connection");
        connection.setWeight(parseFloat(Main.weightSetter.find("input").val(), 10));
        Main.weightSetter.removeData("current-connection");
        Main.weightSetter.addClass("hidden");
    });

    Main.weightSetter.find("input").on("focusout", function(e) {
        Main.weightSetter.addClass("hidden");
    });

    //Run the network.
    Main.toolbar.find("#run").on("click", function(e) {
        var neurons = Main.layer.get(".neuron").map(function(x){return x.neuron;});
        var connections = Main.layer.get(".connection").map(function(x){return x.connection;});
        ann = new Main.NeuralNetwork(neurons, connections);
        console.log(ann);
    });
});
