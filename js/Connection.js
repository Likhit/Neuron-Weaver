Main.Connection = {
    _CONNECTIONCOUNTER: 0,

    _container: {},

    create: function(paper, x, y) {
        var connection = {
            to: NaN,
            from: NaN,
            weight: 0,
            code: this._CONNECTIONCOUNTER++,
            GUI: {
                attrs: {_selected: false},
                elems: {}
            },
            type: "Connection"
        };

        connection.GUI.elems.path = paper.path(Raphael.format("M{0},{1}", x, y)).attr({
            "stroke": "#e0e0e0",
            "stroke-width": 2
        });

        connection.GUI.elems.weightBox = paper.text(x + 10, y + 20, "").attr({
            "font-family": "Times New Roman",
            "font-weight": 900,
            "font-size": 12
        }).hide();

        for (var i in connection.GUI.elems) {
            connection.GUI.elems[i].data("parent", connection);
        }

        this._container[connection.code] = connection;
        this._addEventHandlers(connection);
        return connection;
    },

    destroy: function(connection) {
        for (var i in connection.GUI.elems) {
            connection.GUI.elems[i].remove();
        }
        try {
            var to = Main.Neuron.getElementByCode(connection.to);
            Main.Neuron.setDraggable(to);
        } catch (Error) {}
        try {
            var from = Main.Neuron.getElementByCode(connection.from);
            Main.Neuron.setDraggable(from);
        } catch (Error) {}
        delete this._container[connection.code];
    },

    extendPathTo: function(connection, x, y) {
        var pathStr = connection.GUI.elems.path.attr("path");
        connection.GUI.elems.path.attr("path", pathStr + Raphael.format("L{0},{1}", x, y));
    },

    set: function(connection, attr, val) {
        switch(attr) {
            case "from":
                if (val && val.type === "Neuron") {
                    Main.Neuron.setDraggable(val, false);
                    connection.from = val.code;
                    connection.GUI.elems.path.attr("stroke", "#a0a0a0");
                }
                break;
            case "to":
                if (val && val.type === "Neuron" && !isNaN(connection.from)) {
                    Main.Neuron.setDraggable(val, false);
                    connection.to = val.code;
                    connection.GUI.elems.path.attr({
                        "stroke": "#000",
                        "arrow-end": "classic-wide-long"
                    });
                    var length = connection.GUI.elems.path.getTotalLength();
                    var midPoint = connection.GUI.elems.path.getPointAtLength(length/2);
                    connection.GUI.elems.weightBox.attr({
                        text: "W: 0",
                        x: midPoint.x,
                        y: midPoint.y - 8,
                        title: Raphael.fullfill("Connection {code}\n►To: {to}\n►From: {from}\n►Weight: {weight}", connection)
                    }).show();
                }
                break;
            case "weight":
                connection.weight = val;
                connection.GUI.elems.weightBox.attr({
                    "text": "W: " + val,
                    title: Raphael.fullfill("Connection {code}\n►To: {to}\n►From: {from}\n►Weight: {weight}", connection)
                });
                break;
        }
    },

    _addEventHandlers: function(connection) {
        //Add selection on click.
        function clickHandler(e) {
            if (!Main.Connection.isSelected(connection) && !Main.toolbar.data("selected")) {
                Main.Selection.add(connection);
                Main.weightOrThresholdSetter.removeClass("hidden")
                    .find("input").val(connection.weight).focus();
                Main.weightOrThresholdSetter.find("span.add-on>strong").text("Weight:");
                Main.statusbar.text("Connection from " + connection.from + " to " + connection.to + " selected.");
            }
            else {
                Main.Selection.remove(connection);
                Main.weightOrThresholdSetter.addClass("hidden");
            }
        }

        connection.GUI.elems.weightBox.click(clickHandler);
        connection.GUI.elems.path.click(clickHandler);

        //Add drag capability on weightBox.
        function dragStart() {
            this.ox = this.attr("x");
            this.oy = this.attr("y");
        }

        function dragMove(dx, dy) {
            this.attr({
                x: this.ox + dx,
                y: this.oy + dy
            });
        }

        function dragEnd() {
            delete this.ox;
            delete this.oy;
        }

        connection.GUI.elems.weightBox.drag(dragMove, dragStart, dragEnd);
    },

    setWeight: function(connection, val) {
        connection.weight = val;
        connection.GUI.elems.weightBox.attr("text", "W: " + val);
        return this;
    },

    select: function(connection) {
        connection.GUI.attrs._selected = true;
        connection.GUI.elems.weightBox.attr("fill", "blue");
        connection.GUI.elems.path.attr("stroke", "blue");
        return this;
    },

    deselect: function(connection) {
        connection.GUI.attrs._selected = false;
        connection.GUI.elems.weightBox.attr("fill", "black");
        connection.GUI.elems.path.attr("stroke", "black");
        return this;
    },

    isSelected: function(connection) {
        return connection.GUI.attrs._selected;
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