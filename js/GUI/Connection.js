Main.Connection = function(paper, x, y) {
    this.to = NaN;
    this.from = NaN;
    this.weight = 0;
    this.length = 1;
    this.code = Main.Connection._CONNECTIONCOUNTER++;
    this._selected = false;
    this.type = "Connection";
    this.GUI = {};

    this.GUI.path = paper.path(Raphael.format("M{0},{1}", x, y)).attr({
        "stroke": "#555",
        "stroke-width": 2
    });

    this.GUI.weightBox = paper.text(x + 10, y + 20, "").attr({
        "font-family": "Times New Roman",
        "font-weight": 900,
        "font-size": 12,
        "fill": "#ddd"
    }).hide();

    for (var i in this.GUI) {
        this.GUI[i].data("parent", this);
    }

    Main.Connection._container[this.code] = this;
    this._addEventHandlers(this);
};

Main.Connection._CONNECTIONCOUNTER = 0;

Main.Connection._container = {};

Main.Connection.prototype.destroy = function() {
    for (var i in this.GUI) {
        this.GUI[i].remove();
    }
    try {
        Main.Neuron.getElementByCode(this.to).setDraggable();
    } catch (Error) {}
    try {
        Main.Neuron.getElementByCode(this.from).setDraggable();
    } catch (Error) {}
    delete Main.Connection._container[this.code];
};

Main.Connection.prototype.extendPathTo = function(x, y) {
    var pathStr = this.GUI.path.attr("path");
    this.GUI.path.attr("path", pathStr + Raphael.format("L{0},{1}", x, y));
    return this;
};

Main.Connection.prototype.set = function(attr, val) {
    switch(attr) {
        case "from":
            if (val && val.type === "Neuron") {
                val.setDraggable(false);
                this.from = val.code;
                this.GUI.path.attr("stroke", "#111");
            }
            break;
        case "to":
            if (val && val.type === "Neuron" && !isNaN(this.from)) {
                val.setDraggable(false);
                this.to = val.code;
                this.GUI.path.attr({
                    "stroke": "#a0a0a0",
                    "arrow-end": "classic-wide-long"
                });
                var length = this.GUI.path.getTotalLength();
                var midPoint = this.GUI.path.getPointAtLength(length/2);
                this.GUI.weightBox.attr({
                    text: "W: 0",
                    x: midPoint.x,
                    y: midPoint.y - 8,
                    title: Raphael.fullfill("Connection {code}\n►To: {to}\n►From: {from}\n►Weight: {weight}\n►length: {length}", this)
                }).show();
            }
            break;
        case "weight":
            this.weight = val;
            this.GUI.weightBox.attr({
                "text": "W: " + val,
                title: Raphael.fullfill("Connection {code}\n►To: {to}\n►From: {from}\n►Weight: {weight}\n►length: {length}", this)
            });
            break;
        case "length":
            this.length = val;
            break;
    }
};

Main.Connection.prototype.get = function(attr) {
    switch(attr) {
        case "from":
            return this.from;
        case "to":
            return this.to;
        case "weight":
            return this.weight;
        case "length":
            return this.length;
        case "code":
            return this.code;
    }
};

Main.Connection.prototype._addEventHandlers = function() {
    var connection = this;
    //Add selection on click.
    function clickHandler(e) {
        if (!connection.isSelected() && !Main.canvas.data("current-tool")) {
            Main.Selection.add(connection);
            if (Main.connectionSettingsForm.hasClass("hide")) {
                var form = Main.connectionSettingsForm.removeClass("hide");
                form.find("#length-value").val(connection.length);
                form.find("#weight-value").val(connection.weight).focus();
            }
        }
        else {
            Main.Selection.remove(connection);
            if (Main.Selection.getLength() === 0) {
                Main.connectionSettingsForm.addClass("hide");
            }
        }
    }

    connection.GUI.weightBox.click(clickHandler);
    connection.GUI.path.click(clickHandler);

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

    connection.GUI.weightBox.drag(dragMove, dragStart, dragEnd);
};

Main.Connection.prototype.select = function() {
    this._selected = true;
    this.GUI.weightBox.attr("fill", "#DAD085");
    this.GUI.path.attr("stroke", "#DAD085");
    return this;
};

Main.Connection.prototype.deselect = function() {
    this._selected = false;
    this.GUI.weightBox.attr("fill", "#ddd");
    this.GUI.path.attr("stroke", "#a0a0a0");
    return this;
};

Main.Connection.prototype.isSelected = function() {
    return this._selected;
};

Main.Connection.getAll = function() {
    return this._container;
};

Main.Connection.getElementByCode = function(code) {
    return this._container[code];
};