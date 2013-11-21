/*
    Step
*/

var Step = Class.extend({

    // Global vars
    order:      0,
    type:       '',
    position:   0,
    text:       '',

    // Init
    init: function(params) {
        this.order      = params.order      || 0;
        this.type       = params.type       || 'then';
        this.position   = params.position   || 0;
        this.text       = params.text       || '';
    },

    toJSON: function() {
        return { type: this.type, text: this.text }
    }

});