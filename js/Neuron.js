Main.Neuron = function() {
    this.code = Main.Neuron.neuronCounter++;
    this.threshold = 0;
    this.inputs = [];
    this.output = NaN;
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
        radius: 40
    });
    
    var circle = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 25,
        stroke: "black",
        fill: "rgba(255, 255, 255, 0)",
        strokeWidth: 3
    });

    var outputBox = new Kinetic.Text({
        x: x - 25,
        y: y - 15,
        text: "",
        fontSize: 25,
        fontFamily: "Times New Roman",
        fill: "black",
        fontStyle: "bold",
        width: 50,
        height: 50,
        align: "center"
    });

    this.gui.add(hitRegion).add(circle).add(outputBox);
    this.addEventHandlers();
    try {
        layer.add(this.gui).draw();
    } catch (TypeError) {
        throw Error("Layer must be an object of Kinetic.Layer.");
    }
};

Main.Neuron.prototype.redraw = function() {
    this.gui.getLayer().draw();
}

Main.Neuron.prototype.fire = function() {
    var sum = this.inputs.length === 0 ? NaN : this.inputs.reduce(function(x, a){return x + a;}, 0);
    this.output = isNaN(sum) ? NaN : sum >= this.threshold ? 1 : 0;
    this.gui.children[2].setText(isNaN(this.output) ? "" : this.output);
    return this.output;
};

Main.Neuron.prototype.addEventHandlers = function() {
    var $this = this;

    this.gui.on("click.erase", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected && selected.id === "eraser") {
            var layer = $this.gui.getLayer();
            $this.gui.remove();
            layer.draw();
        }
    });

    this.gui.on("click.set-threshold", function(e) {
        var selected = Main.toolbar.data("selected");
        if (!selected) {
            Main.thresholdSetter.removeClass("hidden")
                .find("input").val($this.threshold).focus();
            Main.thresholdSetter.data("current-neuron", $this);
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

Main.InputNeuron = function(neuron) {
    if (neuron !== undefined) {
        this.code = neuron.code;
        this.threshold = 1;
        this.inputs = neuron.inputs;
        this.output = neuron.output;
        var position = neuron.gui.children[0].getPosition();
        this.addToLayer(Main.layer, position.x, position.y);
        neuron.gui.destroy();
    }
    else {
        Main.Neuron.call(this);
    }
    this.threshold = 1;
}

Main.InputNeuron.prototype = Object.create(Main.Neuron.prototype);

Main.InputNeuron.prototype.addToLayer = function(layer, x, y) {
    try {
       Main.Neuron.prototype.addToLayer.call(this, null, x, y);
    } catch(Error) {
        //Do nothing. Works as expected. I don't want to add the neuron to the layer yet.
    }

    var inputBox = new Kinetic.Rect({
        x: x - 75,
        y: y - 12.5,
        width: 25,
        height: 25,
        stroke: "black",
        strokeWidth: 2
    });

    var inputText = new Kinetic.Text({
        x: x - 75,
        y: y - 10,
        text: "",
        fontSize: 18,
        fontFamily: "Times New Roman",
        fill: "blue",
        width: 25,
        height: 25,
        align: "center",
        name: "inp"
    });

    var line = new Kinetic.Line({
        points: [[x - 50, y], [x - 25, y]],
        stroke: "black",
        strokeWidth: 2
    });
    
    this.gui.setDraggable(true);
    this.gui.add(inputText).add(inputBox).add(line);
    layer.add(this.gui).draw();
};

Main.InputNeuron.prototype.setInput = function(val) {
    this.input = [val];
    var inputText = this.gui.get(".inp")[0];
    inputText.setText(val);
};

Main.InputNeuron.prototype.addEventHandlers = function() {
    Main.Neuron.prototype.addEventHandlers.call(this);
    var $this = this;

    this.gui.get(".inp")[0].on("click", function(e) {
        //Input setting box.
    });
};