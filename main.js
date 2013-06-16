var Main = {};
var ANN = {};

$(function() {
    $("body").removeClass("hide");

    Main.paper = Raphael("canvas-container", 0.93*screen.availWidth, 0.80*screen.availHeight);

    Main.canvas = $(Main.paper.canvas);

    Main.globalSettingsForm = $("#global-settings-form");
    Main.neuronSettingsForm = $("#neuron-settings-form");
    Main.connectionSettingsForm = $("#connection-settings-form");

    {% include "js/GUI/formHandler.js" %}
    {% include "js/GUI/buildBar.js" %}
});

{% include "js/GUI/Selection.js" %}
{% include "js/GUI/Neuron.js" %}
{% include "js/GUI/Connection.js" %}
{% include "js/GUI/NeuralNetwork.js" %}


{% include "js/ANN/Activations.js" %}
{% include "js/ANN/Neuron.js" %}
{% include "js/ANN/NeuralNetwork.js" %}
