Main.trainingDataSetter = $("#set-training-data").first();

//Show training-data setting form.
Main.trainingDataSetter.on("show", function(e) {
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

    //Initialize with old previously saved values.
    Main.trainingDataSetter.removeClass("hidden");
    var wavelength = Main.trainingDataSetter.data("wavelength");
    Main.trainingDataSetter.find("#appendedPrependedInput").focus().val(isNaN(wavelength) ? "" : wavelength);
    try {
        var trainingSets = Main.trainingDataSetter.data("training-sets");
        var trainingSetHolders = Main.trainingDataSetter.find("tbody>tr");
        for (var i = 0, l = trainingSetHolders.length; i < l; i++) {
            trainingSetHolders.eq(i).find("input").each(function(index) {
                var val = trainingSets[i][index];
                $(this).val(isNaN(val) ? "" : val);
            });
        }
    } catch(Error) {}
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