/*
    Plan
*/

var Plan = Class.extend({

    // Global vars
    title:      '',
    endtime:    '',
    steps:      [],

    // Init
    init: function(title, endtime) {
        this.title      = title;
        this.endtime    = endtime;
    },

    //
    addStep: function(step) {
        this.steps.push(step);
    },

    //
    removeStep: function(idx) {
        this.steps.splice(idx, 1);
    },


    save: function() {

    }
});