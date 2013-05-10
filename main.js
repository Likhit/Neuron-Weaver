var Main = {
    Selection: {
        _container: {},

        type: "",

        add: function(obj) {
            if (this.type && this.type === obj.type) {
                this._container[obj.code] = obj;
            }
            else {
                this.type = obj.type;
                this._container = {};
                this._container[obj.code] = obj;
            }
            this.getTypeContext().select(obj);
        },

        getTypeContext: function() {
            switch(this.type) {
                case "Neuron":
                    return Main.Neuron;
                case "Connection":
                    return Main.Connection;
            }
        },

        getAll: function() {
            var result = [];
            for (var i in this._container) {
                result.push(this._container[i]);
            }
            return result;
        },

        remove: function(obj) {
            if (this.type === obj.type) {
                delete this._container[obj.code];
            }
            this.getTypeContext().deselect(obj);
        },

        clear: function() {
            var objs = this.getAll();
            var typeContext = this.getTypeContext();
            for (var i = 0; i < objs.length; i++) {
                typeContext.deselect(objs[i]);
            }
            this._container = {};
            this.type = "";
        }
    }
};
$(function() {
    $("body").removeClass("hidden");
    
    {% include "templates/frontstage/frontstage.js" %}

    {% include "templates/backstage/backstage.js" %}
});
