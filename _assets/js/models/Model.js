/*
    Model

    The base model class
*/

var Model = Class.extend({

    name:       'tp-model',

    id:         null,
    store:      null,
    records:    [],

    // Init
    init: function() {
        this.store = localStorage.getItem(this.name);
        this.records = (this.store && this.store.split(",")) || [];
    },

    // Generate four random hex digits.
    S4: function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    guid: function() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    },

    create: function(json) {

        this.fromJSON(json);
        this.save();

        return this.id;
    },

    save: function() {
        // Need a way to use other DB 'engines'. For now, localStorage.
        var obj = this.toJSON();
        
        if( this.id ) {
            obj.id = this.id;
        }
        else {
            obj.id  = this.guid();
            this.id = obj.id;

            this.records.push(obj.id);
            localStorage.setItem(this.name, this.records.join(","));
        }

        localStorage.setItem(this.name+'-'+obj.id, JSON.stringify(obj));

        return this.id;
    },

    find: function(id) {
        var json    = JSON.parse(localStorage.getItem(this.name+"-"+id));

        // convert the saved json data into the object itself as class properies.
        this.fromJSON(json);

        return this;
    },

    findAll: function() {
        return this.records.map(function(id) {
            var json = JSON.parse(localStorage.getItem(this.name+"-"+id));
            this.fromJSON(json);
            return this;
        }, this);
    },

    fromJSON: function(json) {
        for( var prop in json ) {
            this[prop] = json[prop];
        }

        return this;
    }

});
