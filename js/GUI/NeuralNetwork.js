Main.NeuralNetwork = function() {
    this.network = this.createNetwork();
};

Main.NeuralNetwork.prototype.createNetwork = function() {
    var neurons = Main.Neuron.getAll();
    var connections = Main.Connection.getAll();

    var matrix = [];
    for (var code in connections) {
        var connection = connections[code];

        if (matrix[connection.from] === undefined) {
            matrix[connection.from] = [];
        }

        var connectionProperties = {
            length: connection.length,
            weight: connection.weight
        };

        matrix[connection.from][connection.to] = connectionProperties;       
    }

    var inputNodeCodes = [];
    var outputNodeCodes = [];
    for (var code in neurons) {
        var neuron = neurons[code];
        if (neuron.isInputNeuron) {
            inputNodeCodes.push(code);
        }
        if (neuron.isOutputNeuron) {
            outputNodeCodes.push(code);
        }
    }
    inputNodeCodes.sort();
    outputNodeCodes.sort();

    var inputNeurons = inputNodeCodes.map(function(i) { return neurons[i]; });
    var outputNeurons = outputNodeCodes.map(function(i) { return neurons[i]; });

    return new ANN.NeuralNetwork({
        neurons: neurons,
        matrix: matrix,
        inputNeurons: inputNeurons,
        outputNeurons: outputNeurons
    });
}

// Main.NeuralNetwork = function(neurons, connections) {
//     this.neurons = neurons;
//     this.connections = connections;
//     this.inputNodes = [];
//     this.outputNodes = [];
//     this.weights = {};
//     this.code = Main.NeuralNetwork._NETWORKCOUNTER++;
//     this.type = "ANN";

//     var isInputNode = {}, isOutputNode = {};
//     for (var i = 0, l = this.connections.length; i < l; i++) {
//         isInputNode[this.connections[i].to] = false;
//         isOutputNode[this.connections[i].from] = false;
//         var weightList = this.weights[this.connections[i].to];
//         if (weightList === undefined) {
//             this.weights[this.connections[i].to] = {};
//         }
//         this.weights[this.connections[i].to][this.connections[i].from] = this.connections[i].weight;
//     }
    
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         if (isInputNode[this.neurons[i].code] !== false) {
//             this.inputNodes.push(i);
//             //Convert this neuron into a neuron of type InputNeuron.
//             Main.addInputTraits(this.neurons[i]);
//         }
//         if (isOutputNode[this.neurons[i].code] !== false) {
//             this.outputNodes.push(i);
//             //Convert this neuron into a neuron of type OutputNeuron.
//             Main.addOutputTraits(this.neurons[i]);
//         }
//     }

//     Main.NeuralNetwork._container[this.code] = this;
// };

// Main.NeuralNetwork._NETWORKCOUNTER = 0;

// Main.NeuralNetwork._container = {};

// Main.NeuralNetwork.prototype.fire = function() {
//     //Fire all neurons.
//     this.resultVectors.push([]);
//     var lastVector = this.resultVectors[this.resultVectors.length - 1];
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         lastVector.push(this.neurons[i].fire());
//     }
// };

// Main.NeuralNetwork.prototype.propogateOutputs = function() {
//     //Update the input buffers of each neuron.
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         this.neurons[i].inputs = []; //Reset the input buffer.
//         var weights = this.weights[this.neurons[i].code];
//         for (var j in weights) {
//             var input = this.findNeuronByCode(parseInt(j, 10)).output;
//             if (!isNaN(input) && input !== undefined) {
//                 this.neurons[i].inputs.push(weights[j]*input);
//             }
//         }
//     }
// };

// Main.NeuralNetwork.prototype.compute = function(inputSets, wavelength) {
//     this.resultVectors = [];
//     var defaultResult = {
//         net: NaN,
//         output: NaN
//     };
//     for (var i = 0, l1 = inputSets.length; i < l1; i++) {
//         Main.statusbar.text("Computing input set " + i + ".");
//         for (var j = 0, l2 = this.inputNodes.length; j < l2; j++) {
//             var neuron = this.neurons[this.inputNodes[j]];
//             var input = inputSets[i][j];
//             if (!isNaN(input)) {
//                 neuron.inputs = [inputSets[i][j]];
//             }
//         }
//         for (var j = 0; j < wavelength; j++) {
//             this.fire();
//             this.propogateOutputs();
//         }
//         this.resultVectors.push([]);
//         var lastVector = this.resultVectors[this.resultVectors.length - 1];
//         for (var j = 0, l2 = this.neurons.length; j < l2; j++) {
//             lastVector.push(defaultResult);
//         }
//     }    
//     Main.statusbar.text("Computation completed.");
// };

// Main.NeuralNetwork.prototype.startAnimation = function(timeUnit, startCallBack, endCallBack) {
//     var $this = this;
//     if (!this.animationObject) {
//         this.animationObject = {
//             cycleNum: 0,
//             timeUnit: timeUnit,
//             onIntervalStart: startCallBack,
//             onIntervalClear: endCallBack
//         };
//     }
//     this.animationObject.interval = setInterval(function() {
//         for (var i = 0, l = $this.resultVectors[$this.animationObject.cycleNum].length; i < l; i++) {
//             var result = $this.resultVectors[$this.animationObject.cycleNum][i];
//             $this.neurons[i].setNet(result.net);
//             $this.neurons[i].setOutput(result.output);
//         }
//         Main.paper.draw();
//         if (++$this.animationObject.cycleNum >= $this.resultVectors.length) {
//             $this.stopAnimation();
//             Main.statusbar.text("Network animation completed.");
//         }
//     }, timeUnit);
//     this.animationObject.onIntervalStart();
// };

// Main.NeuralNetwork.prototype.pauseAnimation = function() {
//     clearInterval(this.animationObject.interval);
//     Main.statusbar.text("Network animation paused.");
// };

// Main.NeuralNetwork.prototype.resumeAnimation = function() {
//     this.startAnimation(this.animationObject.timeUnit);
//     Main.statusbar.text("Network animation resumed.");
// };

// Main.NeuralNetwork.prototype.stopAnimation = function() {
//     clearInterval(this.animationObject.interval);
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         this.neurons[i].setOutput(NaN);
//         this.neurons[i].setNet(NaN);
//     }
//     Main.paper.draw();
//     this.animationObject.onIntervalClear();
//     delete this.animationObject;
//     Main.statusbar.text("Network animation stopped.");
// };

// Main.NeuralNetwork.prototype.stepNext = function() {
//     for (var i = 0, l = this.resultVectors[this.animationObject.cycleNum].length; i < l; i++) {
//         var result = this.resultVectors[this.animationObject.cycleNum][i];
//         this.neurons[i].setNet(result.net);
//         this.neurons[i].setOutput(result.output);
//     }
//     Main.paper.draw();
//     if (++this.animationObject.cycleNum >= this.resultVectors.length) {
//         this.stopAnimation();
//         Main.statusbar.text("Network animation completed.");
//     }
// };

// Main.NeuralNetwork.prototype.stepBack = function() {
//     for (var i = 0, l = this.resultVectors[this.animationObject.cycleNum].length; i < l; i++) {
//         var result = this.resultVectors[this.animationObject.cycleNum][i];
//         this.neurons[i].setNet(result.net);
//         this.neurons[i].setOutput(result.output);
//     }
//     Main.paper.draw();
//     if (this.animationObject.cycleNum > 0) {
//         this.animationObject.cycleNum--;
//     }
// };

// Main.NeuralNetwork.prototype.findNeuronByCode = function(code) {
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         if (this.neurons[i].code === code) {
//             return this.neurons[i];
//         }
//     }
//     return -1;
// };

// Main.NeuralNetwork.prototype.dismantle = function(code) {
//     try {
//         this.stopAnimation();
//     } catch(Error) {}
//     for (var i = 0, l = this.neurons.length; i < l; i++) {
//         Main.removeTraits(this.neurons[i]);
//     }
//     Main.paper.draw();
// };