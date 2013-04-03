Main.weightOrThresholdSetter = $("#set-weights-or-thresholds").first();
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