Main.Neuron = function() {
    this.code = Main.Neuron.neuronCounter++;
    this.threshold = 0;
    this.inputs = [];
};

Main.Neuron.neuronCounter = 0;

Main.Neuron.prototype.addToLayer = function(layer, x, y) {
    this.gui = new Kinetic.Group({
        name: "neuron"
    });

    this.gui.neuron = this;
    
    var hitRegion = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 40,
        name: "padding"
    });
    
    var circle = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 25,
        stroke: "black",
        fill: "rgba(255, 255, 255, 0)",
        strokeWidth: 3,
        name: "body"
    });

    var thresholdBox = new Kinetic.Text({
        x: x - 25,
        y: y + 30,
        text: "θ:" + this.threshold,
        fontSize: 12,
        fontFamily: "Times New Roman",
        fill: "black",
        fontStyle: "bold",
        width: 50,
        height: 50,
        align: "center",
        name: "threshold"
    });

    var codeBox = new Kinetic.Text({
        x: x - 25,
        y: y - 40,
        text: "#" + this.code,
        fontSize: 12,
        fontFamily: "Times New Roman",
        fill: "black",
        fontStyle: "bold",
        width: 50,
        height: 50,
        align: "center",
        name: "code"
    });

    var outputBox = new Kinetic.Text({
        x: x - 15,
        y: y - 15,
        text: "",
        fontSize: 25,
        fontFamily: "Times New Roman",
        fill: "black",
        fontStyle: "bold",
        width: 50,
        height: 50,
        align: "center",
        name: "output"
    });

    var netBox = new Kinetic.Text({
        x: x - 35,
        y: y - 7,
        text: "",
        fontSize: 10,
        fontFamily: "Times New Roman",
        fill: "black",
        fontStyle: "bold",
        width: 50,
        height: 50,
        align: "center",
        name: "net"
    });

    this.gui.add(hitRegion).add(circle).add(thresholdBox).add(outputBox).add(codeBox).add(netBox);
    this.addEventHandlers();
    try {
        layer.add(this.gui).draw();
    } catch (TypeError) {
        throw Error("Layer must be an object of Kinetic.Layer.");
    }
};

Main.Neuron.prototype.fire = function() {
    var net = this.inputs.length === 0 ? NaN : this.inputs.reduce(function(x, a) {
        return x + a;
    }, 0);
    
    this.output = this.thresholder(net);
    return { 
        net: net,
        output: this.output
    };
};

Main.Neuron.prototype.thresholder = function(net) {
    return isNaN(net) ? NaN : net < this.threshold ? 0 : 1;
}

Main.Neuron.prototype.setThreshold = function(val) {
    this.threshold = val;
    this.gui.get(".threshold")[0].setText("θ:" + val);
    this.gui.getLayer().draw();
};

Main.Neuron.prototype.setOutput = function(val) {
    var newFill = "rgba(255, 255, 255, 0)";
    if (!isNaN(val)) {
        newFill = "rgba(255, 215, 0, 25)";
    }
    this.gui.get(".output").apply("setText", isNaN(val) ? "" : val);
    this.gui.get(".body").apply("setFill", newFill);
};

Main.Neuron.prototype.setNet = function(val) {
    this.gui.get(".net").apply("setText", isNaN(val) ? "" : "Σ:" + val);
};

Main.Neuron.prototype.addEventHandlers = function() {
    var $this = this;

    this.gui.on("click.erase", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected && selected.id === "eraser") {
            var layer = $this.gui.getLayer();
            $this.gui.remove();
            layer.draw();
            Main.statusbar.text("Neuron " + $this.code + " erased.");
        }
    });

    this.gui.on("click.set-threshold", function(e) {
        var selected = Main.toolbar.data("selected");
        if (!selected) {
            Main.weightOrThresholdSetter.removeClass("hidden")
                .find("input").val($this.threshold).focus();
            Main.weightOrThresholdSetter.find("span.add-on>strong").text("Threshold:");
            Main.weightOrThresholdSetter.data("current-neuron", $this);
            Main.statusbar.text("Neuron " + $this.code + " selected.");
        }
    });

    this.gui.on("mousedown.add-to-connection", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected && selected.id === "connect") {
            Main.toolbar.data("connect-from", $this.code);
        }
    });

    this.gui.on("mouseup.add-to-connection", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected && selected.id === "connect") {
            Main.toolbar.data("connect-to", $this.code);
        }
    });
};

Main.addInputTraits = function(neuron) {
    neuron.setThreshold(1);

    var position = neuron.gui.get(".padding")[0].getPosition();
    var x = position.x, y = position.y;

    var inputTraits = new Kinetic.Group({
        name: "input-traits"
    });

    //Draw an arrow.
    var line1 = new Kinetic.Line({
        points: [[x - 50, y], [x - 30, y]],
        stroke: "black",
        strokeWidth: 1.5
    });

    var line2 = new Kinetic.Line({
        points: [[x - 35, y - 5], [x - 30, y]],
        stroke: "black",
        strokeWidth: 1.5
    });

    var line3 = new Kinetic.Line({
        points: [[x - 35, y + 5], [x - 30, y]],
        stroke: "black",
        strokeWidth: 1.5
    });
    
    inputTraits.add(line1).add(line2).add(line3);
    neuron.gui.add(inputTraits);
};

Main.addOutputTraits = function(neuron) {
    var position = neuron.gui.get(".padding")[0].getPosition();
    var x = position.x, y = position.y;

    var innerCircle = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 23,
        stroke: "black",
        fill: "rgba(255, 255, 255, 0)",
        strokeWidth: 2,
        name: "output-traits"
    });

    var body = neuron.gui.get(".body");
    body.apply("setStrokeWidth", 2);
    body.apply("setRadius", 27);
    neuron.gui.add(innerCircle);
};

Main.removeTraits = function(neuron) {
    neuron.gui.get(".output-traits").apply("destroy");
    neuron.gui.get(".input-traits").apply("destroy");
    var body = neuron.gui.get(".body");
    body.apply("setStrokeWidth", 3);
    body.apply("setRadius", 25);
};