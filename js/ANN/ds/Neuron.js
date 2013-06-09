Main.Neuron = function(paper, x, y) {
    this._threshold = 0;
    this.inputs = [];
    this._net = NaN;
    this.output = NaN;
    this.code = Main.Neuron._NEURONCOUNTER++;
    this.GUI = {
        attrs: {
            _draggable: true,
            _selected: false,
            paper: paper
        },
        elems: {}
    };
    this.type = "Neuron";
    this.isInputNeuron = false;
    this.isOutputNeuron = false;

    this.GUI.elems.codeBox = paper.text(x - 2, y - 32, "#" + this.code).attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12,
        "fill": "#ddd"
    });

    this.GUI.elems.thresholdBox = paper.text(x - 2, y + 32, "θ:" + this._threshold).attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12,
        "fill": "#ddd"
    });

    this.GUI.elems.netBox = paper.text(x - 12, y, "Σ:-").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 11,
        "fill": "#ddd"
    });

    this.GUI.elems.outputBox = paper.text(x + 12, y, "-").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 22,
        "fill": "#ddd"
    });

    this.GUI.elems.outerCircle = paper.circle(x, y, 33).attr({
        fill: "transparent",
        stroke: "transparent"
    });

    this.GUI.elems.middleCircle = paper.circle(x, y, 25).attr({
        fill: "transparent",
        stroke: "#ddd",
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

Main.Neuron.prototype.on = function(eventName, func) {
    var neuron = this;
    function eventHandler(e) {
        e.neuron = neuron;
        func(e);
    }

    this.GUI.elems.innerCircle[eventName](eventHandler);
    this.GUI.elems.middleCircle[eventName](eventHandler);
};

Main.Neuron.prototype._addEventHandlers = function() {
    //Add selection on click.
    var neuron = this;
    function clickHandler(e) {
        var form = Main.neuronSettingsForm;
        var inputTraitCheckbox = form.find("#input-trait");
        var outputTraitCheckbox = form.find("#output-trait");
        
        if (!neuron.isSelected() && !Main.canvas.data("current-tool")) {
            Main.Selection.add(neuron);
            if (form.hasClass("hide")) {
                form.removeClass("hide");
                inputTraitCheckbox.prop("checked", neuron.isInputNeuron).prop("indeterminate", false);
                outputTraitCheckbox.prop("checked", neuron.isOutputNeuron).prop("indeterminate", false);
                form.find("#threshold-value").val(neuron._threshold).focus();
            }
            else {
                if ((inputTraitCheckbox.prop("checked") && !neuron.isInputNeuron) || 
                        (!inputTraitCheckbox.prop("checked") && neuron.isInputNeuron)) {
                    inputTraitCheckbox.prop("indeterminate", true);
                }
                if ((outputTraitCheckbox.prop("checked") && !neuron.isOutputNeuron) || 
                        (!outputTraitCheckbox.prop("checked") && neuron.isOutputNeuron)) {
                    outputTraitCheckbox.prop("indeterminate", true);
                }
            }
        }
        else {
            Main.Selection.remove(neuron);
            if (Main.Selection.getLength() === 0) {
                form.addClass("hide");
            }
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
            this.outputBox.attr({ x: newPos.cx + (neuron.isInputNeuron ? 0 : 12), y: newPos.cy });
            //neuron.guiSet.transform(Raphael.format("t{0},{1}", dx, dy));
            if (neuron.isOutputNeuron) {
                this.outputIdentifier.attr(newPos);
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
    this.GUI.elems.middleCircle.attr("stroke", "#dad085");
    this.GUI.elems.netBox.attr("fill", "#dad085");
    this.GUI.elems.codeBox.attr("fill", "#dad085");
    this.GUI.elems.outputBox.attr("fill", "#dad085");
    this.GUI.elems.thresholdBox.attr("fill", "#dad085");
    if (this.isOutputNeuron) {
        this.GUI.elems.outputIdentifier.attr("stroke", "#dad085");    
    }
    return this;
};

Main.Neuron.prototype.deselect = function() {
    this.GUI.attrs._selected = false;
    this.GUI.elems.middleCircle.attr("stroke", "#ddd");
    this.GUI.elems.netBox.attr("fill", "#ddd");
    this.GUI.elems.codeBox.attr("fill", "#ddd");
    this.GUI.elems.outputBox.attr("fill", "#ddd");
    this.GUI.elems.thresholdBox.attr("fill", "#ddd");
    if (this.isOutputNeuron) {
        this.GUI.elems.outputIdentifier.attr("stroke", "#ddd");    
    }
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

Main.Neuron.prototype.setActivation = function(func) {
    var threshold = this._threshold;
    this.activation = function (net) {
        return func(net, threshold);
    };
    return this;
};

Main.Neuron.prototype.fire = function() {
    var net = this.inputs.length === 0 ? NaN : this.inputs.reduce(function(x, a) {
        return x + a;
    }, 0);

    return isNaN(net) ? NaN : this.activation(net);
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

Main.Neuron.addInputTraits = function(code) {
    var neuron = this.getElementByCode(code);
    if (!neuron.isInputNeuron) {
        neuron.isInputNeuron = true;
        neuron.GUI.elems.netBox.hide();
        neuron.GUI.elems.outputBox.attr("x", neuron.GUI.elems.innerCircle.attr("cx"));
    }
    return this;
};

Main.Neuron.addOutputTraits = function(code) {
    var neuron = this.getElementByCode(code);
    if (!neuron.isOutputNeuron) {
        neuron.isOutputNeuron = true;
        var reference = neuron.GUI.elems.middleCircle;
        var x = reference.attr("cx"), y = reference.attr("cy"), r = reference.attr("r");
        neuron.GUI.elems.outputIdentifier = neuron.GUI.attrs.paper.circle(x, y, r + 1).attr({
            "stroke": "#dad085",
            "stroke-width": 2
        });
        neuron.GUI.elems.middleCircle.attr("r", r - 3);
    }
    return this;
};

Main.Neuron.removeTraits = function(code, traitType) {
    var neuron = this.getElementByCode(code);
    if (traitType !== "output") {
        neuron.isInputNeuron = false;
        neuron.GUI.elems.netBox.show();
        neuron.GUI.elems.outputBox.attr("x", neuron.GUI.elems.innerCircle.attr("cx") + 12);
    }
    else if (neuron.GUI.elems.outputIdentifier !== undefined && traitType !== "input") {
        neuron.isOutputNeuron = false;
        neuron.GUI.elems.outputIdentifier.remove();
        neuron.GUI.elems.middleCircle.attr("r", neuron.GUI.elems.middleCircle.attr("r") + 3);
        delete neuron.GUI.elems.outputIdentifier;
    }
    return this;
};

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