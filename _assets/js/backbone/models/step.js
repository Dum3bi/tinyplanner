
(function() {
    'use strict';

    TinyPlanner.Models.Step = Backbone.Model.extend({

        localStorage: new Backbone.LocalStorage('tiny-step'),

        defaults: function() {
            return {
                text:           '',
                duration: {
                    days:       0,
                    hours:      0,
                    minutes:    0
                },
            };
        },

    });

    // Collection

    TinyPlanner.Collections.Steps = Backbone.Collection.extend({

        model: TinyPlanner.Models.Step,

        localStorage: new Backbone.LocalStorage('tiny-step'),

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