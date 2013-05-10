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

//Create the network.
$("#run").on("show", function(e) {
    var selected = Main.toolbar.data("selected");
    if (selected !== undefined) {
        Main.toolbar.removeData("selected");
        Main.canvas.css("cursor", "auto");
        Main.paper.get(".neuron").apply("setDraggable", true);
        $(selected).removeClass("sel");
    }
    var neurons = Main.paper.get(".neuron").map(function(x){return x.neuron;});
    var connections = Main.paper.get(".connection").map(function(x){return x.connection;});
    Main.ann = new Main.NeuralNetwork(neurons, connections);
});