(function() {
    var settingsMenu = $("#settings-button");
    //Settings menu functionality.
    settingsMenu.click(function(e) {
        Main.globalSettingsForm.removeClass("hide").find("#network-name").focus();
    });

    Main.globalSettingsForm.submit(function(e) {
        e.preventDefault();
        
        var networkName = Main.globalSettingsForm.find("#network-name").val();
        var networkDescription = Main.globalSettingsForm.find("#network-description").val();
        $(".network-name>p").text(networkName).attr("title", networkDescription);

        //var thresholdValue = parseFloat(Main.globalSettingsForm.find("#threshold-value").val(), 10);

        Main.globalSettingsForm.addClass("hide");
    });

    Main.globalSettingsForm.find("button[type!='submit']").click(function(e) {
        e.preventDefault();
        Main.globalSettingsForm.addClass("hide");
    });

    //Neuron settings.
    Main.neuronSettingsForm.submit(function(e) {
        e.preventDefault();
        var threshold = parseFloat(Main.neuronSettingsForm.find("#threshold-value").val(), 10);
        var selectedNeurons = Main.Selection.getAll();
        for (var i = 0, l = selectedNeurons.length; i < l; i++) {
            selectedNeurons[i].setThreshold(threshold);
        }

        Main.neuronSettingsForm.addClass("hide");
        Main.Selection.clear();
    });

    Main.neuronSettingsForm.find("button[type!='submit']").click(function(e) {
        e.preventDefault();
        Main.neuronSettingsForm.addClass("hide");
        Main.Selection.clear();
    });

    Main.neuronSettingsForm.find("#input-trait").change(function(e) {
        var $this = $(this);
        var selectedNeurons = Main.Selection.getAll();
        if ($this.is(":checked")) {
            for (var i = 0, l = selectedNeurons.length; i < l; i++) {
                Main.Neuron.addInputTraits(selectedNeurons[i].code);
            }
        }
        else {
            for (var i = 0, l = selectedNeurons.length; i < l; i++) {
                Main.Neuron.removeTraits(selectedNeurons[i].code, "input");
            }
        }
    });

    Main.neuronSettingsForm.find("#output-trait").change(function(e) {
        var $this = $(this);
        var selectedNeurons = Main.Selection.getAll();
        if ($this.is(":checked")) {
            for (var i = 0, l = selectedNeurons.length; i < l; i++) {
                Main.Neuron.addOutputTraits(selectedNeurons[i].code);
            }
        }
        else {
            for (var i = 0, l = selectedNeurons.length; i < l; i++) {
                Main.Neuron.removeTraits(selectedNeurons[i].code, "output");
            }
        }
    });

    //Connection settings.
    Main.connectionSettingsForm.submit(function(e) {
        e.preventDefault();
        var weight = parseFloat(Main.connectionSettingsForm.find("#weight-value").val(), 10);
        var length = parseInt(Main.connectionSettingsForm.find("#length-value").val(), 10);
        var selectedConnections = Main.Selection.getAll();
        for (var i = 0, l = selectedConnections.length; i < l; i++) {
            selectedConnections[i].set("weight", weight);
            selectedConnections[i].set("length", length);
        }

        Main.connectionSettingsForm.addClass("hide");
        Main.Selection.clear();
    });

    Main.connectionSettingsForm.find("button[type!='submit']").click(function(e) {
        e.preventDefault();
        Main.connectionSettingsForm.addClass("hide");
        Main.Selection.clear();
    });
})();