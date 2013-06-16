ANN.Activations = {
    activationGenerators: {
        identity: function() {
            return function(net) {
                return net;
            }
        },

        thresholder: function(threshold) {
            return function(net) {
                return net < threshold ? 0 : 1;
            }
        }
    },

    add: function(name, func) {
        if (!this.activationGenerators[name]) {
            this.activationGenerators[name] = func;
            return true;
        }
        return false;
    },

    //Takes an argument of the form ActivatorName:arg1,arg2,arg3...
    get: function(activatorString) {
        var elems = activatorString.split(':');
        var activatorName = elems[0];
        var activatorArgs = elems[1].split(',').map(function(x) {
            parseInt(x, 10);
        });

        var activationGenerator = this.activationGenerators[activatorName];
        return activationGenerator.apply(activationGenerator, activatorArgs);
    }
};