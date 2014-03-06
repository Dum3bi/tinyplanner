
(function() {
    'use strict';

    var PlanList,
        PlanItem,
        AddPlan;

    TinyPlanner.Views.Index = Backbone.View.extend({

        template: _.template( $("#template-home").html() ),

        initialize: function() {
            this.$el.html( this.template() );
            
            new PlanList({ el: '.plans', collection: this.collection }).render();

            new AddPlan({ el: '.page' }).render();
        }

    });


    PlanList = Backbone.View.extend({

        initialize: function(options) {
            this.listenTo(this.collection, 'add', this.renderPlan);
        },

        renderPlan: function(plan) {
            var elm = new PlanItem({ model: plan }).render().el

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
            this.collection.each(function(model) {
                this.renderPlan(model);
            }, this);

            return this;
        }

    });


    PlanItem = Backbone.View.extend({
        className: 'plan',

        template: _.template( $("#template-plan").html() ),

        events: {
            'click .cover-panel': 'loadPlan',
            'click .delete': 'deletePlan'
        },

        loadPlan: function() {
            TinyPlanner.router.navigate('plan/'+this.model.id, { trigger: true } );
        },

        deletePlan: function() {
            var self    = this,
                $plan   = $(this.el);

            $plan.css('overflow', 'hidden').animate({ height: 0}, 500, function() {
                $plan.remove();

                self.model.getSteps();

                // remove associated steps
                self.model.steps.each(function(step) {
                    step.destroy();
                }, this);

                // remove the plan
                self.model.destroy();
            });
        },

        render: function() {
            this.$el.html( this.template( { plan: this.model } ) );
            
            return this;
        },
    });


    AddPlan = Backbone.View.extend({

        template: _.template( $("#template-add-plan").html() ),

        events: {
            'click .add-plan': 'newPlan'
        },

        newPlan: function() {
            TinyPlanner.router.navigate('plan/new', { trigger: true } );
        },

        render: function() {
            this.$el.append( this.template() );

            return this;
        }
    });

})();