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
            obj.select();
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
            obj.deselect();
        },

        clear: function() {
            var objs = this.getAll();
            for (var i = 0; i < objs.length; i++) {
                objs[i].deselect();
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
