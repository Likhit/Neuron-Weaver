//Dismantle the network.
$("#build").on("show", function(e) {
    if (e.relatedTarget && e.relatedTarget.id === "run") {
        Main.ann.dismantle();
        delete Main.ann;
    }
});