
(function() {
    'use strict';

    TinyPlanner.Router = Backbone.Router.extend({

        routes: {
            ''              : 'index',
            'plan/new'      : 'newPlan',
            'plan/:id'      : 'viewPlan',
            'step/new/:id'  : 'newStep'
        },

        index: function() {
            TinyPlanner.Plans = new TinyPlanner.Collections.Plans();
            TinyPlanner.Plans.fetch();

            TinyPlanner.Plans.fetch().then(function() {
                TinyPlanner.currentView = new TinyPlanner.Views.Index();
            });
        },

        viewPlan: function(id) {
            TinyPlanner.Plans = new TinyPlanner.Collections.Plans();
            TinyPlanner.Plans.fetch()

            var plan = new TinyPlanner.Models.Plan();

            if(id) {
                plan.id = id;
                plan.fetch().then(function() {
                    TinyPlanner.currentView = new TinyPlanner.Views.Plan({ model: plan });
                });
                
            }
        },

        newStep: function(id) {
            TinyPlanner.Plans = new TinyPlanner.Collections.Plans();
            TinyPlanner.Plans.fetch()

            var plan = new TinyPlanner.Models.Plan();

            if(id) {
                plan.id = id;
                plan.fetch().then(function() {
                    TinyPlanner.currentView = new TinyPlanner.Views.NewStep({ model: plan });
                });
            }
        }
    });

})();