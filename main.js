var Main = {};

$(function() {
    $("body").removeClass("hide");

    Main.paper = Raphael("canvas-container", 0.93*screen.availWidth, 0.80*screen.availHeight);

    Main.canvas = $(Main.paper.canvas);

    Main.globalSettingsForm = $("#global-settings-form");
    Main.neuronSettingsForm = $("#neuron-settings-form");
    Main.connectionSettingsForm = $("#connection-settings-form");

    {% include "js/ANN/formHandler.js" %}
    {% include "js/ANN/buildBar.js" %}
});

{% include "js/ANN/ds/Selection.js" %}
{% include "js/ANN/ds/Activations.js" %}
{% include "js/ANN/ds/Neuron.js" %}
{% include "js/ANN/ds/Connection.js" %}
{% include "js/ANN/ds/NeuralNetwork.js" %}
