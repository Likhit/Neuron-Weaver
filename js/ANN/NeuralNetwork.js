ANN.NeuralNetwork = function(obj) {
    this.neurons = obj.neurons; //{code: neuron}
    this.matrix  = obj.matrix;  //[from.code][to.code] -> {connectionProperties}
    this.inputNeurons  = obj.inputNodes; //[neurons]
    this.outputNeurons = obj.outputNeurons; //[neurons]
};

ANN.NeuralNetwork.prototype.feedInput = function(inputArr) {
    try {
        for (var i = 0, l = this.inputNeurons.length; i < l; i++) {
            this.inputNeurons[i].feedInputs(inputArr[i]);
        }
    }
    catch (Error) {
        console.error("Malformed input provided to the network.");
    }
};

ANN.NeuralNetwork.prototype.run = function(inputs, isOutputFound) {
    this.feedInput(inputs);
    var activeNeurons = {};
    for (var i = 0, l = this.inputNeurons.length; i < l; i++) {
        activeNeurons[this.inputNeurons[i].code] = 1;
    }

    while (!isOutputFound()) {
        for (var code in activeNeurons) {
            activeNeurons[code]--;
            if (activeNeurons[code] === 0) {
                this.neurons[code].fire();
                delete activeNeurons[code];

                var connectionsTo = this.matrix[code];
                for (var i = 0, l = connectionsTo.length; i < l; i++) {
                    var connectionProperties = connectionsTo[i];
                    activeNeurons[connectionProperties.code] = connectionProperties.length;
                }
            }
        }
    }

    var output = [];
    for (var i = 0, l = this.outputNeurons.length; i < l; i++) {
        output.push(this.outputNeurons[i].getOutput());
    }
    return output;
}