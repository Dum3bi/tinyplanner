/*
    Home Controller.

    Handles all logic for the 'home' screen.
*/
var HomeController = TinyMVC.Controller.extend({

    steps: [],

    initialize: function() {
        this.el = $2('.tiny-planner');
    },

    // Home page
    index: function() {
        // Kind of a hacky way to mimic a static function.
        var plans = (new Plan).findAll();

        // Load the view
        new TinyPlanner.Home({ el: this.el, plans: plans }).render();
    }

});