
(function() {

    TinyPlanner.PlanView = TinyMVC.View.extend({

        events: {
            'keypress .add-step': 'saveStep',
            'click .add-step': 'saveStep'
        },

        render: function() {
            var view    = '',
                steps   = this.steps,
                plan    = this.plan;

            // Plan info
            view += _template('plans-edit', {
                title:          plan.title,
                starttime:      plan.startTime_text,
                endtime:        plan.endTime_text,
                totalduration:  plan.getDurationInText()
            });

            // List of steps
            var step_html = '';

            for (var i = 0; i < steps.length; i++) {
                var s = steps[i];

                step_html += new TinyPlanner.StepItem({ model: steps[i]} ).render();
            };

            view += _template('plan-steps', { steps: step_html });

            // New step form
            view += _template('add-step');

            this.el.innerHTML = view;
        },

        saveStep: function(e) {
            if( e.keyCode == 13 || e.target.nodeName.toLowerCase() == 'button' ) {
                tinyrouter.route('step/create/'+this.plan.id);
            }
        }
    })

    TinyPlanner.PlanItem = TinyMVC.View.extend({

        template: 'plan',

        render: function() {
            return _template('plan', { id: this.plan.id, title: this.plan.title });
        }
    });
    
})(this);