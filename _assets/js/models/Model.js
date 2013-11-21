/*
    Model

    The base model class
*/

var Model = Class.extend({

    name:       'tp-model',
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

    save: function() {
        // Need a way to use other DB 'engines'. For now, localStorage.
        var obj = this.toJSON();
        obj.id = this.guid();

        this.id = obj.id;

        this.records.push(obj.id);
        localStorage.setItem(this.name, this.records.join(","));

        localStorage.setItem(this.name+'-'+obj.id, JSON.stringify(obj));
    },

    find: function(id) {
        return JSON.parse(localStorage.getItem(this.name+"-"+id));
    },

    findAll: function() {
        return this.records.map(function(id) {
            return JSON.parse(localStorage.getItem(this.name+"-"+id));
        }, this);
    }

});
