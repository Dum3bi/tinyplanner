
(function() {
    'use strict';

    TinyPlanner.Views.Plan = Backbone.View.extend({
        
        template: _.template( $("#template-plans-edit").html() ),

        initialize: function () {
            var self = this;

            this.render();
        },

        render: function(id) {
            console.log(this.model);

            this.$el.html( this.template({ plan: this.model }) );
            // this.$('.new-step-form').html( _.template( $('#template-add-step').html() ) );
            
            return this;
        },

    });

})();