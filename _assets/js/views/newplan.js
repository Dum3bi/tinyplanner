
(function() {
    'use strict';

    var StepList,
        StepItem;

    TinyPlanner.Views.NewPlan = Backbone.View.extend({

        el: '.tiny-planner',
        
        template: _.template( $("#template-new-plan").html() ),

        events: {
            'keypress .new-plan': 'createPlan',
            'click .new-plan': 'createPlan'
        },

        initialize: function () {
            this.$el.html( this.template() );
        },

        createPlan: function( event ) {
            if (
                   (event.type == 'keypress' && event.which !== 13)
                || (event.type == 'click' && event.target.nodeName != 'BUTTON' )
                || !this.$('[name=plan-name]').val().trim()
            ) {
                return;
            }

            var plan = new TinyPlanner.Models.Plan({
                title: this.$('[name=plan-name]').val().trim()
            });

            plan.save();

            TinyPlanner.Plans.add(plan);

            //
            this.$('[name=plan-name]').val('');

            TinyPlanner.currentView = new TinyPlanner.Views.Index();
            TinyPlanner.router.navigate('');
        },

    });

})();