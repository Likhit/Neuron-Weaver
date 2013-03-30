Main.NeuralNetwork = function(neurons, connections) {
    this.neurons = neurons.sort(function(x, y) {
        if (x.code < y.code)
            return -1;
        else if (x.code > y.code)
            return 1;
        else
            return 0;
    });
    this.connections = connections;
    this.inputNodes = [];
    this.outputNodes = [];
    this.weights = {};

    var isInputNode = {}, isOutputNode = {};
    for (var i = 0, l = this.connections.length; i < l; i++) {
        isInputNode[this.connections[i].to] = false;
        isOutputNode[this.connections[i].from] = false;
        var weightList = this.weights[this.connections[i].to];
        if (weightList === undefined) {
            this.weights[this.connections[i].to] = {};
        }
        this.weights[this.connections[i].to][this.connections[i].from] = this.connections[i].weight;
    }
    
    for (var i = 0, l = this.neurons.length; i < l; i++) {
        if (isInputNode[this.neurons[i].code] !== false) {
            this.inputNodes.push(i);
            //Convert this neuron into a neuron of type InputNeuron.
            Main.addInputTraits(this.neurons[i]);
        }
        if (isOutputNode[this.neurons[i].code] !== false) {
            this.outputNodes.push(i);
            //Convert this neuron into a neuron of type OutputNeuron.
            Main.addOutputTraits(this.neurons[i]);
        }
    }

    Main.layer.draw();
};

Main.NeuralNetwork.prototype.fire = function() {
    //Fire all neurons.
    for (var i = 0, l = this.neurons.length; i < l; i++) {
        this.neurons[i].fire();
    }
};

Main.NeuralNetwork.prototype.propogateOutputs = function() {
    //Update the input buffers of each neuron.
    for (var i = 0, l = this.neurons.length; i < l; i++) {
        this.neurons[i].inputs = []; //Reset the input buffer.
        var weights = this.weights[this.neurons[i].code];
        for (var j in weights) {
            var input = this.findNeuronByCode(parseInt(j, 10)).output;
            if (!isNaN(input) && input !== undefined) {
                this.neurons[i].inputs.push(weights[j]*input);
            }
        }
    }
};

Main.NeuralNetwork.prototype.run = function() {
    this.fire();
    this.propogateOutputs();
    Main.layer.draw();
};

Main.NeuralNetwork.prototype.findNeuronByCode = function(code) {
    for (var i = 0, l = this.neurons.length; i < l; i++) {
        if (this.neurons[i].code === code) {
            return this.neurons[i];
        }
    }
    return -1;
};

Main.NeuralNetwork.prototype.dismantle = function(code) {
    for (var i = 0, l = this.neurons.length; i < l; i++) {
        Main.removeTraits(this.neurons[i]);
    }
    Main.layer.draw();
};