
(function() {
    'use strict';

    var StepItem,
        AddStep,
        PlanOverview;

    TinyPlanner.Views.Plan = Backbone.View.extend({

        el: '.tiny-planner',
        
        template: _.template( $("#template-view-plan").html() ),

        // events: {
        //     'click .back': 'goBack'
        // },

        initialize: function() {
            var self = this;

            this.$el.html( this.template({ plan: this.model }) );

            this.model.getSteps();

            new TinyPlanner.Views.StepList({ model: this.model, collection: this.model.steps }).render();
            new AddStep({ model: this.model, collection: this.model.steps }).render();
            
            var overview = new PlanOverview({ model: this.model });
            this.$el.append(overview.render().el);

            Hammer($('.back').get(0)).on('tap', function(e) {
                e.stopPropagation();
                e.preventDefault();

                // self.goBack();
                TinyPlanner.currentView = new TinyPlanner.Views.Index();
                TinyPlanner.router.navigate('');
            });
        },

        goBack: function() {
            TinyPlanner.currentView = new TinyPlanner.Views.Index();
            TinyPlanner.router.navigate('');
        }
    });


    TinyPlanner.Views.StepList = Backbone.View.extend({

        el: '.plan-steps',

        initialize: function(options) {
            this.listenTo(this.collection, 'add', this.renderStep);
        },

        renderStep: function(step) {
            var elm = new StepItem({ model: step }).render().el;

            this.$el.append( elm );

            var $elm = $(elm).find('.cover-panel');

            // HAMMER!
            Hammer($elm.get(0)).on('release dragleft swipeleft', function(e) {
                // e.gesture.preventDefault();

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

            plan.id = this.model.get('plan_id');
            plan.fetch();
            plan.getSteps();

            $step.addClass('deleting');
            
            setTimeout(function() {
                $step.remove();

                // remove the step from the plan
                plan.removeStep(self);

                // remove the step
                self.model.destroy();
            }, 600);
        },

        render: function() {
            this.$el.html( this.template( { step: this.model } ) );
            
            return this;
        },
    });


    AddStep = Backbone.View.extend({

        el: '.page',

        template: _.template( $("#template-add-step").html() ),

        events: {
            'click .add-step': 'newStep'
        },

        newStep: function() {
            TinyPlanner.currentView = new TinyPlanner.Views.NewStep({ model: this.model, collection: this.collection });
        },

        render: function() {
            this.$el.append( this.template() );

            return this;
        }
    });


    PlanOverview = Backbone.View.extend({

        className: 'plan-overview',

        template: _.template( $("#template-plan-overview").html() ),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html( this.template({ plan: this.model }) );

            return this;
        }
    });

})();