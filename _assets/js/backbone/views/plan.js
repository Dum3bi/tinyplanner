
(function() {
    'use strict';

    var StepList,
        StepItem;

    TinyPlanner.Views.Plan = Backbone.View.extend({
        
        template: _.template( $("#template-plans-edit").html() ),

        events: {
            'keypress': 'createStep'
        },

        initialize: function () {
            this.render();
        },

        createStep: function() {
            if ( event.which !== 13 || !$('[name=step-title]').val().trim() ) {
                return;
            }

            var s = this.model.steps.create({
                text:       $('[name=step-title]').val().trim(),
                duration:   {
                    days: 0,
                    hours: 0,
                    minutes: $('[name=step-duration]').val().trim()
                }
            });

            var arr = this.model.get('step_ids');
            arr.push(s.id)

            // store the id in the plan's step_id array
            this.model.set('step_ids', arr);
            this.model.save();

            $('[name=step-title]').val('');
            $('[name=step-duration]').val('');
        },

        render: function(id) {
            log( this.model )
            
            this.$el.html( this.template({ plan: this.model }) );
            this.$('.new-step-form').html( _.template( $('#template-add-step').html() ) );

            new StepList({ el: '.steps', collection: this.model.steps }).render();
            
            return this;
        },

    });


    StepList = Backbone.View.extend({

        initialize: function(options) {
            this.listenTo(this.collection, 'add', this.renderStep);
        },

        renderStep: function(step) {
            $('.steps').append( new StepItem({ model: step }).render().el );
        },

        render: function() {                        
            this.collection.each(function(model) {
                this.renderStep(model);
            }, this);

            return this;
        }

    });


    StepItem = Backbone.View.extend({
        tagName: 'div',

        className: 'step',

        template: _.template( $("#template-step").html() ),

        render: function() {
            log( this.model )
            this.$el.html( this.template( { type: 'First', step: this.model } ) );
            
            return this;
        },
    });

})();