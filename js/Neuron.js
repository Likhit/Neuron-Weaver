Main.Neuron = {
    _NEURONCOUNTER: 0,

    _container: {},

    create: function(paper, x, y) {
        var neuron = {
            _threshold: 0,
            inputs: [],
            _net: NaN,
            output: NaN,
            code: this._NEURONCOUNTER++,
            GUI: {
                attrs: {
                    _draggable: true,
                    _selected: false
                },
                elems: {}
            },
            type: "Neuron"
        };

        neuron.GUI.elems.codeBox = paper.text(x - 2, y - 32, "#" + neuron.code).attr({
            "font-family": "Times New Roman",
            "font-weight": 900,
            "font-size": 12
        });

        neuron.GUI.elems.thresholdBox = paper.text(x - 2, y + 32, "θ:" + neuron._threshold).attr({
            "font-family": "Times New Roman",
            "font-weight": 900,
            "font-size": 12
        });

        neuron.GUI.elems.netBox = paper.text(x - 12, y, "Σ:-").attr({
            "font-family": "Times New Roman",
            "font-weight": 900,
            "font-size": 11
        });

        neuron.GUI.elems.outputBox = paper.text(x + 12, y, "-").attr({
            "font-family": "Times New Roman",
            "font-weight": 900,
            "font-size": 22
        });

        neuron.GUI.elems.outerCircle = paper.circle(x, y, 33).attr({
            fill: "transparent",
            stroke: "transparent"
        });

        neuron.GUI.elems.middleCircle = paper.circle(x, y, 25).attr({
            fill: "transparent",
            stroke: "black",
            "stroke-width": 2
        });
        
        neuron.GUI.elems.innerCircle = paper.circle(x, y, 20).attr({
            fill: "transparent",
            stroke: "transparent",
            title: Raphael.fullfill("Neuron {code}\n►Thershold: {_threshold}\n►Net: {_net}\n►Output: {output}", neuron)
        });

        for (var i in neuron.GUI.elems) {
            neuron.GUI.elems[i].data("parent", neuron);
        }

        this._addEventHandlers(neuron);
        this._container[neuron.code] = neuron;
        return neuron;
    },

    destroy: function(neuron) {
        for (var i in neuron.GUI.elems) {
            neuron.GUI.elems[i].remove();
        }
        delete this._container[neuron.code];
    },

    _addEventHandlers: function(neuron) {
        //Add selection on click.
        function clickHandler(e) {
            if (!Main.Neuron.isSelected(neuron) && !Main.toolbar.data("selected")) {
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
            if (Main.Neuron.isDraggable(neuron)) {
                var newPos = { cx: this.innerCircle.ox + dx, cy: this.innerCircle.oy + dy };
                this.innerCircle.attr(newPos);
                this.outerCircle.attr(newPos);
                this.middleCircle.attr(newPos);
                this.codeBox.attr({ x: newPos.cx - 2, y: newPos.cy - 32 });
                this.thresholdBox.attr({ x: newPos.cx - 2, y: newPos.cy + 32 });
                this.netBox.attr({ x: newPos.cx - 12, y: newPos.cy });
                this.outputBox.attr({ x: newPos.cx + 12, y: newPos.cy });
                if (Main.Neuron.isSelected(neuron)) {
                    this._glow.transform(Raphael.format("t{0},{1}", dx, dy));
                }
            }
        }

        function dragEnd() {
            delete this.innerCircle.ox;
            delete this.innerCircle.oy;
        }

        neuron.GUI.elems.innerCircle.drag(dragMove, dragStart, dragEnd, neuron.GUI.elems);
    },

    setDraggable: function(neuron, val) {
        neuron.GUI.attrs._draggable = (val || val === undefined) ? true : false;
        return this;
    },
    
    isDraggable: function(neuron) {
        return neuron.GUI.attrs._draggable;
    },

    select: function(neuron) {
        neuron.GUI.attrs._selected = true;
        neuron.GUI.elems._glow = neuron.GUI.elems.middleCircle.glow({color: "gold", width: 15});
        return this;
    },

    deselect: function(neuron) {
        neuron.GUI.attrs._selected = false;
        neuron.GUI.elems._glow.remove();
        delete neuron.GUI.elems._glow;
        return this;
    },

    isSelected: function(neuron) {
        return neuron.GUI.attrs._selected;
    },

    setThreshold: function(neuron, val) {
        neuron._threshold = val;
        neuron.GUI.elems.thresholdBox.attr("text", "θ:" + val);
        return this;
    },

    getAll: function() {
        var result = [];
            for (var i in this._container) {
            result.push(this._container[i]);
        }
        return result;
    },

    getElementByCode: function(code) {
        return this._container[code];
    }
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