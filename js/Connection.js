Main.Connection = function() {
    this.to = null;
    this.from = null;
    this.weight = 0;
};

Main.Connection.prototype.addToLayer = function(layer, x, y) {
    this.gui = new Kinetic.Group({
        name: "connection"
    });

    this.gui.connection = this;

    var line = new Kinetic.Line({
        stroke: "#e0e0e0",
        strokeWidth: 2,
        points: [[x, y]]
    });

    var textBox = new Kinetic.Text({
        x: line.attrs.points[0].x + 30,
        y: line.attrs.points[0].y - 20,
        text: "0",
        fontSize: 16,
        fontFamily: "Times New Roman",
        fill: "blue",
        fontStyle: "bold",
        width: 40,
        height: 30,
        align: "center",
        draggable: true
    });

    this.gui.add(line).add(textBox);
    this.addEventHandlers();
    layer.add(this.gui).draw();
};

Main.Connection.prototype.addPoint = function(x, y) {
    this.gui.children[0].attrs.points.push({x: x, y: y});
    this.gui.drawScene();
};

Main.Connection.prototype.setWeight = function(val) {
    this.weight = val;
    this.gui.children[1].setText(val);
    this.gui.getLayer().draw();

    try {
        Main.ann.weights[this.to][this.from] = val; 
    } catch(Error) {}
};

Main.Connection.prototype.setLineStroke = function(stroke) {
    this.gui.children[0].setStroke(stroke);
    this.gui.drawScene();
};

Main.Connection.prototype.getLineStroke = function(stroke) {
    return this.gui.children[0].getStroke();
};

Main.Connection.prototype.addEventHandlers = function() {
    var $this = this;

    this.gui.on("click.erase", function(e) {
        var selected = Main.toolbar.data("selected");
        if (selected && selected.id === "eraser") {
            var layer = $this.gui.getLayer();
            $this.gui.remove();
            layer.draw();
            Main.statusbar.text("Connection from " + $this.from + " to " + $this.to + " erased.");
        }
    });

    this.gui.on("click.set-weight", function(e) {
        var selected = Main.toolbar.data("selected");
        if (!selected) {
            Main.weightOrThresholdSetter.removeClass("hidden")
                .find("input").val($this.weight).focus();
            Main.weightOrThresholdSetter.find("span.add-on>strong").text("Weight:");
            Main.weightOrThresholdSetter.data("current-connection", $this);
        }
    });
};