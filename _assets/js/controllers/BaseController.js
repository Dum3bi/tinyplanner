/*
    Base Controller.

    Underlying logic/properties for all further classes.
*/
'use strict'

var BaseController = Class.extend({

    el:         $2('.tiny-planner'),
    events:     [],

    //
    loadEvents: function(events) {
        for (var i = 0; i < this.events.length; i++) {
            this.el.removeEventListener('keypress', this.events[i], false);
        };
        this.el.addEventListener('keypress', events, false);
        this.events.push(events);
    },

    //
    loadClickEvents: function(events) {
        for (var i = 0; i < this.events.length; i++) {
            this.el.removeEventListener('click', this.events[i], false);
        };
        this.el.addEventListener('click', events, false);
        this.events.push(events);
    },
});