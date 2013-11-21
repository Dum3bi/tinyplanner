
'use strict'

document.ready = function() {

    /* A tiny router for a tiny planner */
    var TinyRouter = Class.extend({

        routes: {
            ''              : 'Home',
            'plan'          : 'Plan',
            'plan/new'      : 'Plan@new',
            'plan/edit'     : 'Plan@edit',
        },

        init: function() {
            var self = this;

            // Start the initial route.
            this.route(this);

            // Now bind to the hashchange event for all further routing
            window.addEventListener('hashchange', function(e) { self.route(self) }, false);
        },

        /*
            The meat of the router.
        */
        route: function(self) {
            // Get whatever the hash is and remove the actual has char.
            var hash    = window.location.hash.replace('#', ''),
                id      = 0;

            // Check the hash, and see if there's a third argument, which will be an ID. Store the ID.
            if( hash.split('/').length == 3 ) {
                var split = hash.split('/');
                id      = split[2];
                hash    = split[0]+'/'+split[1];
            }
            
            // Look at the app's routes and get any that conform to the hash.
            var route = self.routes[hash];

            // If a route for that hash has been defined, load it.
            if( route !== undefined ) {
                // Get the controller name and function
                var arr = route.match(/(\w+)@?(\w+)?/);

                // We found a controller
                if( arr.length ) {
                    var str = arr[1]+'Controller';
                    var controller = new window[str];

                    // We also found a method
                    if( arr[2] ) {
                        if( controller[arr[2]] )
                            controller[arr[2]]();
                    }
                    // Otherwise load the index
                    else {
                        if( controller['index'] )
                            controller.index();
                    }
                }
            }
        },

        go: function(location) {
            window.location = '#'+location;
        }
    })

    window.tinyrouter = new TinyRouter;
};


var BaseController = Class.extend({
    el: $2('.tiny-planner')
});

/*
    Home Controller.

    Handles all logic for the homepage.
*/
var HomeController = BaseController.extend({

    index: function() {
        var plans       = [];
        var plans_html  = 'No Plans';

        if( plans.length ) {
            //
        }

        this.el.innerHTML = _template('plans-index', { plans: plans_html });
    }

})


/*
    Plan Controller.

    Handles all logic for the plans.
*/
var PlanController = BaseController.extend({

    plans: [],
    current_idx: 0,

    init: function() {
        //
    },

    new: function() {
        var self = this;

        this.el.innerHTML = _template('plans-new');

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {

                // save the plan
                self.save();

                // Go to the edit page
                tinyrouter.go('plan/edit');
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);
    },

    save: function() {
        var title       = $2('.plan-title').value,
            endtime     = $2('.plan-endtime').value,
            new_plan    = new Plan(title, endtime);

        this.plans.push( new_plan );
        this.current_idx = (this.plans.length - 1);

        console.log(this.plans[this.current_idx]);
    },

    edit: function(id) {
        var self = this;

        this.el.innerHTML = _template('plans-edit');
        this.el.querySelector('.new-step-form').innerHTML = _template('add-first-step');

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {
                self.saveStep();
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);
    },

    view: function(id) {
        //
    },

    saveStep: function() {
        // Get the plan
        var plan = this.plans[this.current_idx];

        console.log(this.current_idx);

        var obj     = { order: 1, type: 'first', position: 0, text: $2('.step-title').value },
            step    = new Step(obj),
            step_html = '';

        // Save the step
        this.plans[this.current_idx].addStep(step);

        for (var i = 0; i < this.plans[this.current_idx].steps.length; i++) {
            step_html += _template('step', this.plans[this.current_idx].steps[i].toJSON() );
        };

        this.el.querySelector('.plan-steps').innerHTML = step_html;
    },

    loadEvents: function(events) {
        this.el.removeEventListener('keypress');
        this.el.addEventListener('keypress', events, false);
    },
});




/*
    Planner
*/

var Planner = Class.extend({

    // Main element
    el: $2('.tiny-planner'),

    // Global vars
    plans:          [],
    current_plan:   '',

    // Init
    init: function() {
        this.loadEvents();
        this.showAllPlans();
    },

    //
    loadEvents: function() {
        var self = this;

        // $2('.tiny-planner').addEventListener('click', function(e) { self.handleEvents(e, self) }, false);
        // $2('.tiny-planner').addEventListener('keypress', function(e) { self.handleEvents(e, self) }, false);
    },

    handleEvents: function(e, self) {
       var t = e.target.className;

        // if( t == 'plan-title' || t == 'plan-endtime' ) {
        //     // user hit the enter key
        //     if( e.keyCode == 13 ) {
        //         self.savePlan();
        //         self.editPlan();
        //     }
        //     else return;
        // }

        // if( t == 'step-title' ) {
        //     // user hit the enter key
        //     if( e.keyCode == 13 ) {
        //         self.saveStep();
        //     }
        //     else return;
        // }

        // e.preventDefault();
    },

    //
    showAllPlans: function() {

        //
    },

    //
    savePlan: function() {
        var title   = $2('.plan-title').value,
            endtime = $2('.plan-endtime').value,
            new_plan = new Plan(title, endtime);

        this.plans.push( new_plan );
        this.current_idx = 0;
    },

    //
    editPlan: function() {
        this.el.innerHTML = _template('plans-edit');
        this.el.querySelector('.new-step-form').innerHTML = _template('add-first-step');
    },

    //
    saveStep: function() {
        var obj     = { order: 1, type: 'first', position: 0, text: $2('.step-title').value },
            step    = new Step(obj),
            step_html = '';

        // console.log(step);

        // Save the step
        this.plans[this.current_idx].addStep(step);

        for (var i = 0; i < this.plans[this.current_idx].steps.length; i++) {
            step_html += _template('step', this.plans[this.current_idx].steps[i].toJSON() );
        };

        this.el.querySelector('.plan-steps').innerHTML = step_html;
    },

})
