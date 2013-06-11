Main.Neuron = function(paper, x, y) {
    this.code = Main.Neuron._NEURONCOUNTER++;
    this._draggable = true;
    this._selected = false;
    this.paper = paper;
    this.type = "Neuron";
    this.isInputNeuron = false;
    this.isOutputNeuron = false;
    this.GUI = {};

    this.GUI.codeBox = paper.text(x - 2, y - 32, "#" + this.code).attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12,
        "fill": "#ddd"
    });

    this.GUI.thresholdBox = paper.text(x - 2, y + 32, "θ: 0").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12,
        "fill": "#ddd"
    });

    this.GUI.netBox = paper.text(x - 12, y, "Σ: -").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 11,
        "fill": "#ddd"
    });

    this.GUI.outputBox = paper.text(x + 12, y, "-").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 22,
        "fill": "#ddd"
    });

    this.GUI.outerCircle = paper.circle(x, y, 33).attr({
        fill: "transparent",
        stroke: "transparent"
    });

    this.GUI.middleCircle = paper.circle(x, y, 25).attr({
        fill: "transparent",
        stroke: "#ddd",
        "stroke-width": 2
    });
    
    this.GUI.innerCircle = paper.circle(x, y, 20).attr({
        fill: "transparent",
        stroke: "transparent",
        title: Raphael.fullfill("Neuron {code}\n►Thershold: {_threshold}\n►Net: {_net}\n►Output: {output}", this)
    });

    for (var i in this.GUI) {
        this.GUI[i].data("parent", this);
    }

    this._addEventHandlers();
    Main.Neuron._container[this.code] = this;
};

Main.Neuron._NEURONCOUNTER = 0;

Main.Neuron._container = {};

Main.Neuron.prototype.destroy = function() {
    for (var i in this.GUI) {
        this.GUI[i].remove();
    }
    delete Main.Neuron._container[this.code];
};

Main.Neuron.prototype.on = function(eventName, func) {
    var neuron = this;
    function eventHandler(e) {
        e.neuron = neuron;
        func(e);
    }

    this.GUI.innerCircle[eventName](eventHandler);
    this.GUI.middleCircle[eventName](eventHandler);
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

    neuron.GUI.innerCircle.click(clickHandler);
    neuron.GUI.middleCircle.click(clickHandler);

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

    neuron.GUI.innerCircle.drag(dragMove, dragStart, dragEnd, neuron.GUI);
};

Main.Neuron.prototype.setDraggable = function(val) {
    this._draggable = (val || val === undefined) ? true : false;
    return this;
};
    
Main.Neuron.prototype.isDraggable = function() {
    return this._draggable;
};

Main.Neuron.prototype.select = function() {
    this._selected = true;
    this.GUI.middleCircle.attr("stroke", "#dad085");
    this.GUI.netBox.attr("fill", "#dad085");
    this.GUI.codeBox.attr("fill", "#dad085");
    this.GUI.outputBox.attr("fill", "#dad085");
    this.GUI.thresholdBox.attr("fill", "#dad085");
    if (this.isOutputNeuron) {
        this.GUI.outputIdentifier.attr("stroke", "#dad085");    
    }
    return this;
};

Main.Neuron.prototype.deselect = function() {
    this._selected = false;
    this.GUI.middleCircle.attr("stroke", "#ddd");
    this.GUI.netBox.attr("fill", "#ddd");
    this.GUI.codeBox.attr("fill", "#ddd");
    this.GUI.outputBox.attr("fill", "#ddd");
    this.GUI.thresholdBox.attr("fill", "#ddd");
    if (this.isOutputNeuron) {
        this.GUI.outputIdentifier.attr("stroke", "#ddd");    
    }
    return this;
};

Main.Neuron.prototype.isSelected = function() {
    return this._selected;
};

Main.Neuron.prototype.set = function(attr, val) {
    switch(attr) {
        case "threshold":
            this.GUI.thresholdBox.attr("text", "θ: " + (isNaN(val) ? '-' : val));
            break;
        case "net":
            this.GUI.netBox.attr("text", "Σ: " + (isNaN(val) ? '-' : val));
            break;
        case "output":
            this.GUI.outputBox.attr("text", isNaN(val) ? '-' : val);
            break;
    }
};

Main.Neuron.prototype.get = function(attr) {
    switch(attr) {
        case "threshold":
            return parseFloat(this.GUI.thresholdBox.attr("text").split(":")[1]);
        case "net":
            return parseFloat(this.GUI.netBox.attr("text").split(":")[1]);
        case "output":
            return parseFloat(this.GUI.outputBox.attr("text"));
        case "code":
            return this.code;
    }
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
        neuron.GUI.netBox.hide();
        neuron.GUI.outputBox.attr("x", neuron.GUI.innerCircle.attr("cx"));
    }
    return this;
};

Main.Neuron.addOutputTraits = function(code) {
    var neuron = this.getElementByCode(code);
    if (!neuron.isOutputNeuron) {
        neuron.isOutputNeuron = true;
        var reference = neuron.GUI.middleCircle;
        var x = reference.attr("cx"), y = reference.attr("cy"), r = reference.attr("r");
        neuron.GUI.outputIdentifier = neuron.paper.circle(x, y, r + 1).attr({
            "stroke": "#dad085",
            "stroke-width": 2
        });
        neuron.GUI.middleCircle.attr("r", r - 3);
    }
    return this;
};

Main.Neuron.removeTraits = function(code, traitType) {
    var neuron = this.getElementByCode(code);
    if (traitType !== "output") {
        neuron.isInputNeuron = false;
        neuron.GUI.netBox.show();
        neuron.GUI.outputBox.attr("x", neuron.GUI.innerCircle.attr("cx") + 12);
    }
    else if (neuron.GUI.outputIdentifier !== undefined && traitType !== "input") {
        neuron.isOutputNeuron = false;
        neuron.GUI.outputIdentifier.remove();
        neuron.GUI.middleCircle.attr("r", neuron.GUI.middleCircle.attr("r") + 3);
        delete neuron.GUI.outputIdentifier;
    }
    return this;
};