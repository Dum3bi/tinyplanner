
(function() {
    'use strict';

    var StepList,
        StepItem,
        AddStep;

    TinyPlanner.Views.Plan = Backbone.View.extend({
        
        template: _.template( $("#template-view-plan").html() ),

        events: {
            'click .back': 'goBack'
        },

        initialize: function() {
            this.$el.html( this.template({ plan: this.model }) );

            new StepList({ el: '.plan-steps', model: this.model, collection: this.model.steps }).render();

            new AddStep({ el: '.page', model: this.model }).render();
        },

        goBack: function() {
            TinyPlanner.router.navigate('', { trigger: true } );
        }
    });


    StepList = Backbone.View.extend({

        initialize: function(options) {
            this.listenTo(this.collection, 'add', this.renderStep);
        },

        renderStep: function(step) {
            var elm = new StepItem({ model: step }).render().el;

            this.$el.append( elm );

            var $elm = $(elm).find('.cover-panel');

            // HAMMER!
            Hammer($elm.get(0)).on('release dragleft swipeleft', function(e) {
                e.gesture.preventDefault();

                if(e.type == 'dragleft') {
                    $elm.removeClass('animate');

                    $elm.css("transform", "translate3d("+ e.gesture.deltaX +"px,0,0)");
                }

                if(e.type == 'swipeleft') {
                    $elm.removeClass('animate');

                    $elm.css("transform", "translate3d(-80px,0,0)");
                }

                if(e.type == 'release') {
                    $elm.removeClass('animate');

                    $elm.addClass('animate');

                    if( e.gesture.deltaX < -40 )
                        $elm.css("transform", "translate3d(-80px,0,0)");
                    else
                        $elm.css("transform", "translate3d(0,0,0)");
                }
            });
        },

        render: function() {                        
            this.collection.each(function(model) {
                this.renderStep(model);
            }, this);

            return this;
        }

    });


    StepItem = Backbone.View.extend({
        className: 'step',

        events: {
            'click .delete': 'deleteStep'
        },

        template: _.template( $("#template-step").html() ),

        deleteStep: function() {
            var self    = this,
                $step   = $(this.el),
                plan    = new TinyPlanner.Models.Plan();

            log(this)

            plan.id = this.model.get('plan_id');
            plan.fetch();
            plan.getSteps();

            $step.css('overflow', 'hidden').animate({ height: 0}, 500, function() {
                $step.remove();

                // remove the step from the plan
                plan.removeStep(self);

                // remove the step
                self.model.destroy();
            });
        },

        render: function() {
            this.$el.html( this.template( { step: this.model } ) );
            
            return this;
        },
    });


    AddStep = Backbone.View.extend({

        template: _.template( $("#template-add-step").html() ),

        events: {
            'click .add-step': 'newStep'
        },

        newStep: function() {
            TinyPlanner.router.navigate('step/new/'+this.model.id, { trigger: true } );
        },

        render: function() {
            this.$el.append( this.template() );

            return this;
        }
    });

})();