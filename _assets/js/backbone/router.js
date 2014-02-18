
(function() {
    'use strict';

    TinyPlanner.Router = Backbone.Router.extend({

        routes: {
            ''          : 'index',
            'plan/:id'  : 'plan'
        },

        index: function(about) {
            var plans = new TinyPlanner.Collections.Plans();

            plans
                .fetch()
                .then(function() {
                    TinyPlanner.currentView = new TinyPlanner.Views.Index({ el: '.tiny-planner', collection: plans });
                });
        },

        plan: function(id) {
            var plan = new TinyPlanner.Models.Plan();

            if(id) {
                plan.id = id;
                plan
                    .fetch()
                    .then(function() {
                        TinyPlanner.currentView = new TinyPlanner.Views.Plan({ el: '.tiny-planner', model: plan });
                    });
                
            }
        }
    });

})();