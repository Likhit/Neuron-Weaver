ANN.Neuron = function(code, activatorString) {
    this.code = code;
    this.activator = ANN.Activations.get(activatorString);
    this.inputs = [];
    this.net  = NaN;
};

ANN.Neuron.prototype.feedInputs = function() {
    this.inputs.push.apply(this.input, arguments);
};

ANN.Neuron.prototype.getOutput = function() {
    return this.activator(this.net);
};

ANN.Neuron.prototype.fire = function() {
    if (this.inputs.length === 0) {
        this.net = NaN;
    }
    else {
        this.net = 0;
        for (var i = 0, l = this.inputs.length; i < l; i++) {
            this.net += this.inputs[i];
        }
    }
};