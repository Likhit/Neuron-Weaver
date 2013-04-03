//Run the network with the supplied input sets.
$("#execute").on("click", function(e) {
    var wavelength = Main.inputSetter.data("wavelength");
    var inputSets = Main.inputSetter.data("input-sets");
    var setIndex = 0, cycle = 0, totalNumOfCycles = (wavelength+1)*inputSets.length;
    var timeUnitInput = $("#time-unit");
    var timeUnit = parseInt(timeUnitInput.val(), 10);
    if (timeUnit < 500) {
        timeUnit = 500;
        timeUnitInput.val(500);
    }
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

//Show input setting form.
$("#inputs").on("click", function(e) {
    Main.inputSetter.trigger("show");
});

//Show training-data setting form.
$("#training-input").on("click", function(e) {
    Main.trainingDataSetter.trigger("show");
});