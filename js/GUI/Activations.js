Main.Activations = {
    _container: {
        identity: function(net) {
            return net;
        },

        thresholder: function(net, threshold) {
            return net < threshold ? 0 : 1;
        }
    },

    add: function(name, func) {
        if (!this._container[name]) {
            this._container[name] = func;
            return true;
        }
        return false;
    },

    get: function(name) {
        return this._container[name];
    }
};