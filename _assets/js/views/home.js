
(function() {

    var PlanForm;

    // Main Home view
    TinyPlanner.Home = TinyMVC.View.extend({

        events: {
            'keypress .plan-form': 'savePlan',
            'click .plan-form': 'savePlan'
        },

        render: function() {
            var view = '',
                plans = this.plans,
                plans_html = '';

            // Plan form
            view += _template('plan-form');

            // List the plans
            if( plans.length ) {
                plans_html = '';
                for (var i = 0; i < plans.length; i++) {
                    plans_html += new TinyPlanner.PlanItem({plan: plans[i]}).render();
                }
            }
            else {
                plans_html = '<div><p>You haven’t created any plans yet, but that’s OK!</p></div>';
            }

            view += _template('home-plans', { plans: plans_html });
            view += _template('footer');

            this.el.innerHTML = view;
        },

        savePlan: function(e) {
           if( e.keyCode == 13 || e.target.className == 'field' ) {
               // save the plan
               tinyrouter.go('plan/create');
           }
        }
    });

    
})(this);