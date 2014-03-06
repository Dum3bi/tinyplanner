
(function() {
    'use strict';

    var StepList,
        StepItem;

    TinyPlanner.Views.NewPlan = Backbone.View.extend({
        
        template: _.template( $("#template-new-plan").html() ),

        events: {
            'keypress': 'createPlan',
            'click': 'createPlan'
        },

        initialize: function () {
            this.$el.html( this.template() );
        },

        createPlan: function( event ) {
            if ( event.which !== 13 || !this.$('[name=plan-name]').val().trim() ) {
                return;
            }

            var plan = new TinyPlanner.Models.Plan({
                title: this.$('[name=plan-name]').val().trim()
            });

            plan.save();

            this.collection.add(plan);

            //
            this.$('[name=plan-name]').val('');

            TinyPlanner.router.navigate('', { trigger: true } );
        },

    });

})();