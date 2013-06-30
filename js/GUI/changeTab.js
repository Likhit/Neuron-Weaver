(function() {
    $(".nav a").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

    //Dismantle the network.
    $("#build-tab-header").on("show", function(e) {
        if (e.relatedTarget && e.relatedTarget.id === "run") {
            Main.ann.dismantle();
            delete Main.ann;
        }
    });

    $("#train-tab-header, #run-tab-header").on("show", function(e) {
        Main.ann = new Main.NeuralNetwork();
        $("#tools").addClass("")
            .siblings("#canvas-area").removeClass("span11").addClass("span4")
            .siblings("#run-area").removeClass("hide");
    });
})();