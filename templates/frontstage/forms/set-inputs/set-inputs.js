Main.inputSetter = $("#set-inputs").first();
//Hide the input setting form and process inputs.
Main.inputSetter.on("show", function(e) {
    //Add a row into #set-inputs for each input node.
    var head = Main.inputSetter.find("thead>tr");
    var body = Main.inputSetter.find("tbody>tr");
    [head, body].forEach(function(x) { x.find("td").remove(); });

    for (var i = 0, l = Main.ann.inputNodes.length; i < l; i++) {
        head.append("<td>" + Main.ann.neurons[Main.ann.inputNodes[i]].code + "</td>");
        body.append('<td><input type="text" placeholder="null"></td>');
    }

    //Initialize with old previously saved values.
    try {
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
    } catch (Error) {}

    Main.inputSetter.removeClass("hidden");
});

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