
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

            // var sc = new TinyPlanner.Collections.Steps;

            // this.model.get('steps').forEach(function(id) {
            //     var step = new TinyPlanner.Models.Step();
            //     step.id = id;
            //     step.fetch().then(function() { sc.add( step ) });
            // });

            // this.model.set('steps', sc);

            if( !this.model.get('steps').length ) {
                this.model.set('steps', new TinyPlanner.Collections.Steps);
            }

            this.render();

            new StepList({ el: '.steps', collection: this.model.get('steps') }).render();
        },

        createStep: function() {
            if ( event.which !== 13 || !$('[name=step-title]').val().trim() ) {
                return;
            }

            console.log(this.model)

            var s = this.model.get('steps').create({
                title: $('[name=step-title]').val().trim()
            });

            // this.model.set('steps', this.model.get('steps').push(s.id) );
            this.model.save();

            $('[name=step-title]').val('');
        },

        render: function(id) {
            this.$el.html( this.template({ plan: this.model }) );
            this.$('.new-step-form').html( _.template( $('#template-add-step').html() ) );
            
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
            this.$el.html( this.template( { starttime: '00:00', type: 'First', step: this.model.toJSON() } ) );
            
            return this;
        },
    });

})();