
(function() {
    'use strict';

    var PlanItem,
        AddPlan,
        NewPlan;

    TinyPlanner.Views.Index = Backbone.View.extend({

        el: '.tiny-planner',

        template: _.template( $("#template-home").html() ),

        initialize: function() {
            this.$el.html( this.template() );
            
            new TinyPlanner.Views.PlanList().render();
            new AddPlan().render();
        }

    });


    TinyPlanner.Views.PlanList = Backbone.View.extend({

        el: '.plans',

        initialize: function(options) {
            this.listenTo(TinyPlanner.Plans, 'add', this.renderPlan);
        },

        renderPlan: function(plan) {
            plan.getSteps();
            
            var elm = new PlanItem({ model: plan }).render().el

            this.$el.append( elm );

            var $elm = $(elm).find('.cover-panel');

            // HAMMER!
            Hammer($elm.get(0)).on('tap release dragleft swipeleft', function(e) {
                // e.gesture.preventDefault();

                if(e.type == 'tap') {
                    e.gesture.preventDefault();
                    e.gesture.stopPropagation();

                    TinyPlanner.currentView = new TinyPlanner.Views.Plan({ model: plan });
                    TinyPlanner.router.navigate('plan/'+plan.id);
                }

                if(e.type == 'dragleft') {
                    $elm.removeClass('animate');

                    $elm.css("transform", "translate3d("+ e.gesture.deltaX +"px,0,0)");
                }

                if(e.type == 'swipeleft') {
                    $elm.removeClass('animate');

                    $elm.css("transform", "translate3d(-90px,0,0)");
                }

                if(e.type == 'release') {
                    $elm.removeClass('animate');

                    $elm.addClass('animate');

                    if( e.gesture.deltaX < -45 )
                        $elm.css("transform", "translate3d(-90px,0,0)");
                    else
                        $elm.css("transform", "translate3d(0,0,0)");
                        
                }
            });
        },

        render: function() {
            TinyPlanner.Plans.each(function(model) {
                this.renderPlan(model);
            }, this);

            return this;
        }

    });


    PlanItem = Backbone.View.extend({
        className: 'plan',

        template: _.template( $("#template-plan").html() ),

        events: {
            'click .delete': 'deletePlan'
        },

        deletePlan: function() {
            var self    = this,
                $plan   = $(this.el);

            $plan.addClass('deleting');
            
            setTimeout(function() {
                $plan.remove();

                self.model.getSteps();

                // remove associated steps
                self.model.steps.each(function(step) {
                    step.destroy();
                }, this);

                // remove the plan
                self.model.destroy();
            }, 600);
        },

        render: function() {
            this.$el.html( this.template( { plan: this.model } ) );

            return this;
        },
    });


    AddPlan = Backbone.View.extend({

        el: '.page',

        template: _.template( $("#template-add-plan").html() ),

        events: {
            'click .add-plan': 'newPlan'
        },

        newPlan: function() {
            TinyPlanner.currentView = new NewPlan();
        },

        render: function() {
            this.$el.append( this.template() );

            return this;
        }
    });


    NewPlan = Backbone.View.extend({

        el: '.tiny-planner',

        className: 'panel',
        
        template: _.template( $("#template-new-plan").html() ),

        events: {
            'keypress .new-plan': 'createPlan',
            'click .new-plan': 'createPlan'
        },

        initialize: function () {
            this.$el.html( this.template() );
            this.$('[name="plan-name"]').focus();
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

            new TinyPlanner.Views.Index();
        },

    });

})();