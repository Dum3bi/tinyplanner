
(function() {
    'use strict';

    TinyPlanner.Views.NewStep = Backbone.View.extend({

        el: '.tiny-planner',
        
        template: _.template( $("#template-new-step").html() ),

        events: {
            'keypress .new-step': 'createStep',
            'click .new-step': 'createStep',
            'click .close': 'close'
        },

        initialize: function () {
            this.$el.html( this.template() );

            this.model.getSteps();
        },

        createStep: function() {
            if (
                    (event.type == 'keypress' && event.which !== 13)
                || (event.type == 'click' && event.target.nodeName != 'BUTTON' )
                || !this.$('[name=step-title]').val().trim()
            ) {
                return;
            }

            var step = new TinyPlanner.Models.Step({
                    plan_id:    this.model.id,
                    text:       $('[name=step-title]').val().trim(),
                    duration:   {
                        days: 0,
                        hours: 0,
                        minutes: $('[name=step-duration]').val().trim() == '' ? 0 : parseInt($('[name=step-duration]').val().trim())
                    }
                }),
                plan = this.model;

            step.save();

            this.collection.add(step);

            plan.updateDuration();
            plan.updateStartTime();

            plan.save();

            TinyPlanner.currentView = new TinyPlanner.Views.Plan({ model: plan });
            TinyPlanner.router.navigate('plan/'+plan.id );
        },

        close: function() {
            TinyPlanner.currentView = new TinyPlanner.Views.Plan({ model: this.model });
            TinyPlanner.router.navigate('plan/'+plan.id );
        }

    });

})();