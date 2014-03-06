
(function() {
    'use strict';

    var StepList,
        StepItem;

    TinyPlanner.Views.NewStep = Backbone.View.extend({
        
        template: _.template( $("#template-new-step").html() ),

        events: {
            'keypress': 'createStep',
            'click': 'createStep'
        },

        initialize: function () {
            this.$el.html( this.template() );
        },

        createStep: function() {
            if ( event.which !== 13 || !$('[name=step-title]').val().trim() ) {
                return;
            }

            var step = new TinyPlanner.Models.Step({
                plan_id:    this.model.id,
                text:       $('[name=step-title]').val().trim(),
                duration:   {
                    days: 0,
                    hours: 0,
                    minutes: $('[name=step-duration]').val().trim()
                }
            });

            step.save();

            this.model.steps.add(step);

            $('[name=step-title]').val('');
            $('[name=step-duration]').val('');

            TinyPlanner.router.navigate('plan/'+this.model.id, { trigger: true } );
        },

    });

})();