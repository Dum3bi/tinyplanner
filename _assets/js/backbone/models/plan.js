
(function() {
    'use strict';

    TinyPlanner.Models.Plan = Backbone.Model.extend({

        localStorage: new Backbone.LocalStorage('tiny-plan'),
       
        defaults: function() {
            return {
                title:          '',
                steps:          new TinyPlanner.Collections.Steps,
                startTime:      0,
                endTime:        0,
                duration: {
                    days:       0,
                    hours:      0,
                    minutes:    0
                },
            };
        },

        getStartTime: function() {
            return '00:00';
        }

    });

    // Collection

    TinyPlanner.Collections.Plans = Backbone.Collection.extend({
        
        model: TinyPlanner.Models.Plan,

        localStorage: new Backbone.LocalStorage('tiny-plan'),

        nextOrder: function() {
            if ( !this.length ) {
                return 1;
            }

            return this.last().get('order') + 1;
        },

        comparator: function( plan ) {
            return plan.get('order');
        }
    });

})();