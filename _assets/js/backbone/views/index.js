
(function() {
    'use strict';

    var PlanList,
        PlanItem;

    TinyPlanner.Views.Index = Backbone.View.extend({

        template: _.template( $("#template-plans-index").html() ),

        events: {
            'keypress': 'createOnEnter',
            'click .field': 'createOnEnter'
        },

        initialize: function(options) {
            // this.listenTo(this.collection, 'add', this.renderPlan);
            this.$el.html( this.template( { plans: '' } ) );
            new PlanList({ el: '.plans', collection: this.collection }).render();
        },

        createOnEnter: function( event ) {
            if ( event.which !== 13 || !this.$('[name=plan-title]').val().trim() ) {
                return;
            }

            this.collection.create({
                title: this.$('[name=plan-title]').val().trim()
            });

            this.$('[name=plan-title]').val('');
        },

    });


    PlanList = Backbone.View.extend({

        initialize: function(options) {
            this.listenTo(this.collection, 'add', this.renderPlan);
        },

        renderPlan: function(plan) {
            this.$el.append( new PlanItem({ model: plan }).render().el );
        },

        render: function() {            
            this.collection.each(function(model) {
                this.renderPlan(model);
            }, this);

            return this;
        }

    });


    PlanItem = Backbone.View.extend({
        tagName: 'div',

        className: 'plan',

        template: _.template( $("#template-plan").html() ),

        events: {
            'click': 'loadPlan'
        },

        loadPlan: function() {
            TinyPlanner.router.navigate('plan/'+this.model.id, { trigger: true } );

            // TinyPlanner.currentView = new TinyPlanner.Views.Plan({ el: '.tiny-planner', model: this.model });
        },

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            
            return this;
        },
    });

})();