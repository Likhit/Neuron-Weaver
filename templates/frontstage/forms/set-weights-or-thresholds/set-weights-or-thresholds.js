Main.weightOrThresholdSetter = $("#set-weights-or-thresholds").first();
//Show threshold setting form.
Main.weightOrThresholdSetter.find("button").on("click", function(e) {
    e.preventDefault();
    
    var elems = Main.Selection.getAll();
    var newValue = parseFloat(Main.weightOrThresholdSetter.find("input").val(), 10);
    
    if (Main.Selection.type === "Neuron") {
        var statusMessage = "Threshold of neurons ";
        var func = "setThreshold";
    }
    
    else if (Main.Selection.type === "Connection") {
        var statusMessage = "Weight of connections ";
        var func = "setWeight";
    }

    for (var i = 0; i < elems.length; i++) {
        elems[i][func](newValue);
        statusMessage += elems[i].code;
        if (i === elems.length - 2) {
            statusMessage += " and";
        }
        else if (i !== elems.length - 1) {
            statusMessage += ", ";
        }
    }

    statusMessage += " set to " + newValue + ".";
    Main.statusbar.text(statusMessage);
    Main.weightOrThresholdSetter.addClass("hidden");
    Main.Selection.clear();
});

Main.weightOrThresholdSetter.find("input").on("focusout", function(e) {
    Main.weightOrThresholdSetter.addClass("hidden");
});