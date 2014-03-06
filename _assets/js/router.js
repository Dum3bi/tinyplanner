
(function() {
    'use strict';

    TinyPlanner.Router = Backbone.Router.extend({

        routes: {
            ''              : 'index',
            'plan/new'      : 'newPlan',
            'plan/:id'      : 'viewPlan',
            'step/new/:id'  : 'newStep'
        },

        index: function(about) {
            var plans = new TinyPlanner.Collections.Plans();

            plans
                .fetch()
                .then(function() {
                    TinyPlanner.currentView = new TinyPlanner.Views.Index({ el: '.tiny-planner', collection: plans });
                });
        },

        newPlan: function() {
            var plans = new TinyPlanner.Collections.Plans();

            TinyPlanner.currentView = new TinyPlanner.Views.NewPlan({ el: '.tiny-planner', collection: plans });
        },

        viewPlan: function(id) {
            var plan = new TinyPlanner.Models.Plan();

            if(id) {
                plan.id = id;
                plan
                    .fetch()
                    .then(function() {
                        
                        // update the plan details
                        plan.getSteps();
                        plan.updateDuration();
                        plan.updateStartTime();

                        plan.save();

                        TinyPlanner.currentView = new TinyPlanner.Views.Plan({ el: '.tiny-planner', model: plan });
                    });
                
            }
        },

        newStep: function(id) {
            var plan = new TinyPlanner.Models.Plan();

            if(id) {
                plan.id = id;
                plan
                    .fetch()
                    .then(function() {
                        
                        // update the plan details
                        plan.getSteps();
                        plan.updateDuration();
                        plan.updateStartTime();

                        plan.save();

                        TinyPlanner.currentView = new TinyPlanner.Views.NewStep({ el: '.tiny-planner', model: plan });
                    });
            }
        }
    });

})();