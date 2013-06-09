//An object to hold selected neurons and connections.
Main.Selection = {
    _container: {},

    _length: 0,

    type: "",

    add: function(obj) {
        if (this.type && this.type === obj.type) {
            this._container[obj.code] = obj;
        }
        else {
            this.clear();
            this.type = obj.type;
            this._container[obj.code] = obj;
        }

        this._length++;
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
            this._length--;
        }
        obj.deselect();
    },

    clear: function() {
        var objs = this.getAll();
        for (var i = 0; i < objs.length; i++) {
            objs[i].deselect();
        }
        this._container = {};
        this._length = 0;
        this.type = "";
    },

    getLength: function() {
        return this._length;
    }
};