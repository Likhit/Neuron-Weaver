Main.Neuron = function(paper, x, y) {
    this._threshold = 0;
    this.inputs = [];
    this._net = NaN;
    this.output = NaN;
    this.code = Main.Neuron._NEURONCOUNTER++;
    this.GUI = {
        attrs: {
            _draggable: true,
            _selected: false
        },
        elems: {}
    };
    this.type = "Neuron";

    this.GUI.elems.codeBox = paper.text(x - 2, y - 32, "#" + this.code).attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12
    });

    this.GUI.elems.thresholdBox = paper.text(x - 2, y + 32, "θ:" + this._threshold).attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12
    });

    this.GUI.elems.netBox = paper.text(x - 12, y, "Σ:-").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 11
    });

    this.GUI.elems.outputBox = paper.text(x + 12, y, "-").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 22
    });

    this.GUI.elems.outerCircle = paper.circle(x, y, 33).attr({
        fill: "transparent",
        stroke: "transparent"
    });

    this.GUI.elems.middleCircle = paper.circle(x, y, 25).attr({
        fill: "transparent",
        stroke: "black",
        "stroke-width": 2
    });
    
    this.GUI.elems.innerCircle = paper.circle(x, y, 20).attr({
        fill: "transparent",
        stroke: "transparent",
        title: Raphael.fullfill("Neuron {code}\n►Thershold: {_threshold}\n►Net: {_net}\n►Output: {output}", this)
    });

    for (var i in this.GUI.elems) {
        this.GUI.elems[i].data("parent", this);
    }

    this._addEventHandlers();
    Main.Neuron._container[this.code] = this;
};

Main.Neuron._NEURONCOUNTER = 0;

Main.Neuron._container = {};

Main.Neuron.prototype.destroy = function() {
    for (var i in this.GUI.elems) {
        this.GUI.elems[i].remove();
    }
    delete Main.Neuron._container[this.code];
};

Main.Neuron.prototype._addEventHandlers = function() {
    //Add selection on click.
    var neuron = this;
    function clickHandler(e) {
        if (!neuron.isSelected() && !Main.toolbar.data("selected")) {
            Main.Selection.add(neuron);
            Main.weightOrThresholdSetter.removeClass("hidden")
                .find("input").val(neuron._threshold).focus();
            Main.weightOrThresholdSetter.find("span.add-on>strong").text("Threshold:");
            Main.statusbar.text("Neuron " + neuron.code + " selected.");
        }
        else {
            Main.Selection.remove(neuron);
            Main.weightOrThresholdSetter.addClass("hidden");
        }
    }

    neuron.GUI.elems.innerCircle.click(clickHandler);
    neuron.GUI.elems.middleCircle.click(clickHandler);

    //Add drag capability.
    function dragStart() {
        this.innerCircle.ox = this.innerCircle.attr("cx");
        this.innerCircle.oy = this.innerCircle.attr("cy");
    }

    function dragMove(dx, dy) {
        if (neuron.isDraggable()) {
            var newPos = { cx: this.innerCircle.ox + dx, cy: this.innerCircle.oy + dy };
            this.innerCircle.attr(newPos);
            this.outerCircle.attr(newPos);
            this.middleCircle.attr(newPos);
            this.codeBox.attr({ x: newPos.cx - 2, y: newPos.cy - 32 });
            this.thresholdBox.attr({ x: newPos.cx - 2, y: newPos.cy + 32 });
            this.netBox.attr({ x: newPos.cx - 12, y: newPos.cy });
            this.outputBox.attr({ x: newPos.cx + 12, y: newPos.cy });
            if (neuron.isSelected()) {
                this._glow.transform(Raphael.format("t{0},{1}", dx, dy));
            }
        }
    }

    function dragEnd() {
        delete this.innerCircle.ox;
        delete this.innerCircle.oy;
    }

    neuron.GUI.elems.innerCircle.drag(dragMove, dragStart, dragEnd, neuron.GUI.elems);
};

Main.Neuron.prototype.setDraggable = function(val) {
    this.GUI.attrs._draggable = (val || val === undefined) ? true : false;
    return this;
};
    
Main.Neuron.prototype.isDraggable = function() {
    return this.GUI.attrs._draggable;
};

Main.Neuron.prototype.select = function() {
    this.GUI.attrs._selected = true;
    this.GUI.elems._glow = this.GUI.elems.middleCircle.glow({color: "gold", width: 15});
    return this;
};

Main.Neuron.prototype.deselect = function() {
    this.GUI.attrs._selected = false;
    this.GUI.elems._glow.remove();
    delete this.GUI.elems._glow;
    return this;
};

Main.Neuron.prototype.isSelected = function() {
    return this.GUI.attrs._selected;
};

Main.Neuron.prototype.setThreshold = function(val) {
    this._threshold = val;
    this.GUI.elems.thresholdBox.attr("text", "θ:" + val);
    return this;
};

Main.Neuron.getAll = function() {
    var result = [];
        for (var i in this._container) {
        result.push(this._container[i]);
    }
    return result;
};

Main.Neuron.getElementByCode = function(code) {
    return this._container[code];
};

// Main.Neuron.prototype.fire = function() {
//     var net = this.inputs.length === 0 ? NaN : this.inputs.reduce(function(x, a) {
//         return x + a;
//     }, 0);
    
//     this.output = this.thresholder(net);
//     return { 
//         net: net,
//         output: this.output
//     };
// };

// Main.Neuron.prototype.thresholder = function(net) {
//     return isNaN(net) ? NaN : net < this.threshold ? 0 : 1;
// }

// Main.Neuron.prototype.setThreshold = function(val) {
//     this.threshold = val;
//     this.gui.get(".threshold")[0].setText("θ:" + val);
//     this.gui.getLayer().draw();
// };

// Main.Neuron.prototype.setOutput = function(val) {
//     var newFill = "rgba(255, 255, 255, 0)";
//     if (!isNaN(val)) {
//         newFill = "rgba(255, 215, 0, 25)";
//     }
//     this.gui.get(".output").apply("setText", isNaN(val) ? "" : val);
//     this.gui.get(".body").apply("setFill", newFill);
// };

// Main.Neuron.prototype.setNet = function(val) {
//     this.gui.get(".net").apply("setText", isNaN(val) ? "" : "Σ:" + val);
// };

// Main.addInputTraits = function(neuron) {
//     neuron.setThreshold(1);

//     var position = neuron.gui.get(".padding")[0].getPosition();
//     var x = position.x, y = position.y;

//     var inputTraits = new Kinetic.Group({
//         name: "input-traits"
//     });

//     //Draw an arrow.
//     var line1 = new Kinetic.Line({
//         points: [[x - 50, y], [x - 30, y]],
//         stroke: "black",
//         strokeWidth: 1.5
//     });

//     var line2 = new Kinetic.Line({
//         points: [[x - 35, y - 5], [x - 30, y]],
//         stroke: "black",
//         strokeWidth: 1.5
//     });

//     var line3 = new Kinetic.Line({
//         points: [[x - 35, y + 5], [x - 30, y]],
//         stroke: "black",
//         strokeWidth: 1.5
//     });
    
//     inputTraits.add(line1).add(line2).add(line3);
//     neuron.gui.add(inputTraits);
// };

// Main.addOutputTraits = function(neuron) {
//     var position = neuron.gui.get(".padding")[0].getPosition();
//     var x = position.x, y = position.y;

//     var innerCircle = new Kinetic.Circle({
//         x: x,
//         y: y,
//         radius: 23,
//         stroke: "black",
//         fill: "rgba(255, 255, 255, 0)",
//         strokeWidth: 2,
//         name: "output-traits"
//     });

//     var body = neuron.gui.get(".body");
//     body.apply("setStrokeWidth", 2);
//     body.apply("setRadius", 27);
//     neuron.gui.add(innerCircle);
// };

// Main.removeTraits = function(neuron) {
//     neuron.gui.get(".output-traits").apply("destroy");
//     neuron.gui.get(".input-traits").apply("destroy");
//     var body = neuron.gui.get(".body");
//     body.apply("setStrokeWidth", 3);
//     body.apply("setRadius", 25);
// };