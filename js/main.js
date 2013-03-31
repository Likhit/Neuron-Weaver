var Main = {};
$(function() {
    $("body").removeClass("hidden");

    var backstage = $("#backstage").hide();
    var frontstage = $("#frontstage");
    
    Main.stage = new Kinetic.Stage({
        container: "canvas-container",
        width: 0.9*screen.availWidth,
        height: 0.85*screen.availHeight
    });

    Main.layer = new Kinetic.Layer();
    
    Main.stage.add(Main.layer);

    Main.toolbar = $("#tools").first();

    Main.trainingDataSetter = $("#set-training-data").first();

    Main.weightOrThresholdSetter = $("#set-weights-or-thresholds").first();

    Main.inputSetter = $("#set-inputs").first();

    Main.statusbar = $("#status-bar").first();

    //Tool selection events.
    Main.toolbar.find("#neuron, #eraser, #connect").on("click", function(e) {
        e.preventDefault();
        var selected = Main.toolbar.data("selected");
        if (selected !== e.currentTarget) {
            $(selected).removeClass("sel");
            Main.toolbar.data("selected", e.currentTarget);
            Main.canvas.css("cursor", "crosshair");
            Main.layer.get(".neuron").apply("setDraggable", false);
            Main.statusbar.text("Tool: " + e.currentTarget.id + " selected.");
        }
        else {
            Main.toolbar.removeData("selected");
            Main.canvas.css("cursor", "auto");
            Main.layer.get(".neuron").apply("setDraggable", true);
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
            Main.layer.get(".neuron").apply("setDraggable", true);
            $(selected).removeClass("sel");
        }
        var neurons = Main.layer.get(".neuron").map(function(x){return x.neuron;});
        var connections = Main.layer.get(".connection").map(function(x){return x.connection;});
        Main.ann = new Main.NeuralNetwork(neurons, connections);
    });

    //Go to backstage.
    frontstage.find("a[href='#backstage']").on("show", function(e) {
        e.preventDefault();
        frontstage.fadeOut(300);
        backstage.slideDown(500);
    });

    //Go to frontstage.
    backstage.find("a[href='#frontstage']").on("show", function(e) {
        e.preventDefault();
        backstage.slideUp(300);
        frontstage.fadeIn(500);
    });

    $("#toggle-ribbon").on("show", function(e) {
        e.preventDefault();
        var target = $(e.target);
        var relatedTarget = $(e.relatedTarget);
        var ul = target.parents("ul");
        var tabContent = ul.parents(".ribbon").find(".tab-content");
        if (!ul.data("collapsed")) {
            tabContent.hide(200);
            setTimeout(function() {
                $(".page").addClass("collapsed-page");
            }, 190);
            target.find("i").removeClass("icon-chevron-up").addClass("icon-chevron-down");
            relatedTarget.parent().removeClass("active");
            ul.data("collapsed", true);
            ul.data("lastOpenTab", relatedTarget);
        }
        else {
            tabContent.show(200);
            setTimeout(function() {
                $(".page").removeClass("collapsed-page");
            }, 190);
            target.find("i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
            ul.removeData("collapsed");   
            ul.data("lastOpenTab").tab('show');
        }
    });

    frontstage.find("a[data-toggle='tab']:not(#toggle-ribbon, #help, [href='#backstage'])").on("show", function(e) {
        var target = $(e.target);
        var ul = target.parents("ul");
        var tabContent = ul.parents(".ribbon").find(".tab-content");
        if (ul.data("collapsed")) {
            tabContent.show(200);
            setTimeout(function() {
                $(".page").removeClass("collapsed-page");
            }, 190);
            ul.find("#toggle-ribbon i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
            ul.removeData("collapsed");
        }
    });

    $("#help").on("show", function(e) {
        e.preventDefault();
        frontstage.find("a[href='#backstage']").tab("show");
        backstage.find("a[href='#help-tab']").tab("show");
    });

    Main.canvas = $(Main.layer.getCanvas().getElement());
    //Add neuron on click.
    Main.canvas.on("click", function(e) {
        var box = e.target.getBoundingClientRect();
        var x = e.clientX - box.left;
        var y = e.clientY - box.top;
        var selected = Main.toolbar.data("selected");
        if (selected !== undefined) {
            switch(selected.id) {
                case "neuron":
                    var neuron = new Main.Neuron();
                    neuron.addToLayer(Main.layer, x, y);
                    Main.statusbar.text("Neuron added.");
                    break;
            }
        }
    });

    //<Add connection>
    Main.canvas.on("mousedown", function(e) {
        var box = e.target.getBoundingClientRect();
        var x = e.clientX - box.left;
        var y = e.clientY - box.top;
        var selected = Main.toolbar.data("selected");
        if (selected !== undefined) {
            switch(selected.id) {
                case "connect":
                    var connection = new Main.Connection();
                    connection.addToLayer(Main.layer, x, y);
                    Main.toolbar.data("current-connection", connection);
                    var counter = 0;
                    var interval = setInterval(function() {
                        connection.from = Main.toolbar.data("connect-from");
                        if (connection.from !== undefined || counter++ > 10) {
                            if (connection.from !== undefined) {
                                connection.setLineStroke("#a0a0a0");
                                Main.statusbar.text("Connection started from " + connection.from + ".");
                            }
                            Main.toolbar.removeData("connect-from");
                            clearInterval(interval);
                        }
                    }, 200);
                    break;
            }
        }
    });

    Main.canvas.on("mousemove", function(e) {
        var box = e.target.getBoundingClientRect();
        var x = e.clientX - box.left;
        var y = e.clientY - box.top;
        var selected = Main.toolbar.data("selected");
        if (selected !== undefined) {
            switch(selected.id) {
                case "connect":
                    var connection = Main.toolbar.data("current-connection");
                    if (connection !== undefined) {
                        connection.addPoint(x, y);
                    }
                    break;
            }
        }
    });

    Main.canvas.on("mouseup", function(e) {
        var box = e.target.getBoundingClientRect();
        var x = e.clientX - box.left;
        var y = e.clientY - box.top;
        var selected = Main.toolbar.data("selected");
        if (selected !== undefined) {
            switch(selected.id) {
                case "connect":
                    var connection = Main.toolbar.data("current-connection");
                    if (connection !== undefined) {
                        connection.addPoint(x, y);
                        Main.toolbar.removeData("current-connection");
                        var counter = 0;
                        var interval = setInterval(function() {
                            connection.to = Main.toolbar.data("connect-to");
                            if (connection.to !== undefined || counter++ > 10) {
                                if (connection.getLineStroke() === "#a0a0a0") {
                                    connection.setLineStroke("black");
                                    Main.statusbar.text("Connection created from " + connection.from + " to " + connection.to + ".");
                                }
                                Main.toolbar.removeData("connect-to");
                                clearInterval(interval);
                            }
                        }, 200);
                    }
                    break;
            }
        }
    });
    //</Add connection>

    //Run the network with the supplied input sets.
    $("#execute").on("click", function(e) {
        var wavelength = Main.inputSetter.data("wavelength");
        var inputSets = Main.inputSetter.data("input-sets");
        var setIndex = 0, cycle = 0, totalNumOfCycles = (wavelength+1)*inputSets.length;
        var timeUnit = parseInt($("#time-unit").val(), 10);
        var interval = setInterval(function() {
            //Feed new inputs.
            if (cycle % (wavelength+1) === 0 && setIndex < inputSets.length) {
                for (var i = 0, l = Main.ann.inputNodes.length; i < l; i++) {
                    var neuron = Main.ann.neurons[Main.ann.inputNodes[i]];
                    var input = inputSets[setIndex][i];
                    if (!isNaN(input)) {
                        neuron.inputs = [inputSets[setIndex][i]];
                    }
                }
                setIndex++;
            }
            Main.ann.run();
            cycle++;
            if (cycle >= totalNumOfCycles) {
                clearInterval(interval);
                delete interval;
            }
        }, timeUnit);
    });

    //Show threshold setting form.
    Main.weightOrThresholdSetter.find("button").on("click", function(e) {
        e.preventDefault();
        var neuron = Main.weightOrThresholdSetter.data("current-neuron");
        if (neuron) {
            neuron.setThreshold(parseFloat(Main.weightOrThresholdSetter.find("input").val(), 10));
            Main.weightOrThresholdSetter.removeData("current-neuron");
            Main.weightOrThresholdSetter.addClass("hidden");
            Main.statusbar.text("Threshold of neuron " + neuron.code + " set to " + neuron.threshold + ".");
            return;
        }
        var connection = Main.weightOrThresholdSetter.data("current-connection");
        if (connection) {
            connection.setWeight(parseFloat(Main.weightOrThresholdSetter.find("input").val(), 10));
            Main.weightOrThresholdSetter.removeData("current-connection");
            Main.weightOrThresholdSetter.addClass("hidden");
            Main.statusbar.text("Weight of connection from " + connection.from + " to " + connection.to + " set to " + connection.weight + ".");
            return;
        }
    });

    Main.weightOrThresholdSetter.find("input").on("focusout", function(e) {
        Main.weightOrThresholdSetter.addClass("hidden");
    });
    
    //Show input setting form.
    $("#inputs").on("click", function(e) {
        //Add a row into #set-inputs for each input node.
        var head = Main.inputSetter.find("thead>tr");
        var body = Main.inputSetter.find("tbody>tr");
        [head, body].forEach(function(x) { x.find("td").remove(); });

        for (var i = 0, l = Main.ann.inputNodes.length; i < l; i++) {
            head.append("<td>" + Main.ann.neurons[Main.ann.inputNodes[i]].code + "</td>");
            body.append('<td><input type="text" placeholder="null"></td>');
        }
        Main.inputSetter.removeClass("hidden");
        //Initialize with old previously saved values.
        var wavelength = Main.inputSetter.data("wavelength");
        Main.inputSetter.find("#appendedPrependedInput").focus().val(isNaN(wavelength) ? "" : wavelength);

        var inputSets = Main.inputSetter.data("input-sets");
        var inputSetHolders = Main.inputSetter.find("tbody>tr");
        for (var i = 0, l = inputSetHolders.length; i < l; i++) {
            inputSetHolders.eq(i).find("input").each(function(index) {
                var val = inputSets[i][index];
                $(this).val(isNaN(val) ? "" : val);
            });
        }
    });

    //Hide the input setting form and process inputs.
    Main.inputSetter.find("button[type='submit']").on("click", function(e) {
        e.preventDefault();
        var inputWavelength = parseInt(Main.inputSetter.find("#appendedPrependedInput").val(), 10);
        var inputSetHolders = Main.inputSetter.find("tbody>tr");
        var inputSets = [];
        for (var i = 0, l = inputSetHolders.length; i < l; i++) {
            inputSets.push(inputSetHolders.eq(i).find("input").map(function(i) {
                return parseFloat($(this).val(), 10);
            }));
        }
        
        Main.inputSetter.data("wavelength", inputWavelength);
        Main.inputSetter.data("input-sets", inputSets);
        Main.inputSetter.addClass("hidden");
    });

    //Add a new row of inputs.
    Main.inputSetter.find("button[type='button']").on("click", function(e) {
        e.preventDefault();
        var body = Main.inputSetter.find("tbody>tr");
        var newRow = body.last().clone();
        newRow.find("span").text(body.length + 1);
        body.last().after(newRow);
        newRow.find("input").first().focus();
    });

    //Show training-data setting form.
    $("#training-input").on("click", function(e) {
        //Add a row into #set-inputs for each input node.
        var head = Main.trainingDataSetter.find("thead");
        var body = Main.trainingDataSetter.find("tbody");
        [head, body].forEach(function(x) { x.find("tr").remove(); });

        var newHead = $("<tr>");
        head.append(newHead);
        head = newHead;

        head.append("<th>#</th>");
        for (var i = 0, l = Main.ann.inputNodes.length; i < l; i++) {
            head.append("<td>" + Main.ann.neurons[Main.ann.inputNodes[i]].code + "</td>");
        }

        head.append("<th>#</th>");
        for (var i = 0, l = Main.ann.outputNodes.length; i < l; i++) {
            head.append("<td>" + Main.ann.neurons[Main.ann.outputNodes[i]].code + "</td>");
        }

        var newBody = $("<tr>");
        body.append(newBody);
        body = newBody;
        for (var index = 1, l1 = 2; index <= l1; index++) {
            newBody = $("<tr>");
            body.last().after(newBody);
            body = newBody;

            body.append("<th>Input Set<span>" + index + "</span></th>");
            for (var i = 0, l = Main.ann.inputNodes.length; i < l; i++) {
                body.append('<td><input type="text" placeholder="null"></td>');
            }

            body.append("<th>Output Set<span>" + index + "</span></th>");
            for (var i = 0, l = Main.ann.outputNodes.length; i < l; i++) {
                body.append('<td><input type="text" placeholder="null"></td>');
            }
        }

        Main.trainingDataSetter.removeClass("hidden");
        //Initialize with old previously saved values.
        var wavelength = Main.trainingDataSetter.data("wavelength");
        Main.trainingDataSetter.find("#appendedPrependedInput").focus().val(isNaN(wavelength) ? "" : wavelength);

        var trainingSets = Main.trainingDataSetter.data("training-sets");
        var trainingSetHolders = Main.trainingDataSetter.find("tbody>tr");
        for (var i = 0, l = trainingSetHolders.length; i < l; i++) {
            trainingSetHolders.eq(i).find("input").each(function(index) {
                var val = trainingSets[i][index];
                $(this).val(isNaN(val) ? "" : val);
            });
        }
    });

    //Hide the input setting form and process inputs.
    Main.trainingDataSetter.find("button[type='submit']").on("click", function(e) {
        e.preventDefault();
        var wavelength = parseInt(Main.trainingDataSetter.find("#appendedPrependedInput").val(), 10);
        var trainingSetHolders = Main.trainingDataSetter.find("tbody>tr");
        var trainingSets = [];
        for (var i = 0, l = trainingSetHolders.length; i < l; i++) {
            trainingSets.push(trainingSetHolders.eq(i).find("input").map(function(i) {
                return parseFloat($(this).val(), 10);
            }));
        }
        Main.trainingDataSetter.data("wavelength", wavelength);
        Main.trainingDataSetter.data("training-sets", trainingSets);
        Main.trainingDataSetter.addClass("hidden");
    });

    //Add a new row of inputs.
    Main.trainingDataSetter.find("button[type='button']").on("click", function(e) {
        e.preventDefault();
        var body = Main.trainingDataSetter.find("tbody>tr");
        var newRow = body.last().clone();
        newRow.find("span").text(body.length);
        body.last().after(newRow);
    });

});
