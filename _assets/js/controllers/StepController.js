/*
    Step Controller.

    Handles all logic for the steps.
*/
var StepController = TinyMVC.Controller.extend({

    initialize: function() {
        this.el = $2('.tiny-planner');
    },

    create: function(id) {
        // Get the plan
        var plan = (new Plan).find(id);

        var position_inc = $2('[name="step-type"]:checked') ? $2('[name="step-type"]:checked').value : '';

        var params = {
                order:      0,
                type:       position_inc == '' ? 'first' : position_inc,
                position:   0, //this.steps.length ? (this.steps[this.steps.length - 1].type == 'meanwhile' ? this.steps[this.steps.length - 1].position + 1 : 1) : 1,
                text:       Input.get('step-title'),
                duration:   parseInt(Input.get('step-duration')),
                unit:       Input.get('step-unit')
            };
        
        var step = new Step;

        // Validation
        var errors = false;

        // Remove any error classes from previous attempts.
        $2('[name="step-title"]').removeClass('error');
        $2('[name="step-duration"]').removeClass('error');

        if( Input.get('step-title') == '' ) {
            $2('[name="step-title"]').addClass('error');
            errors = true;
        }

        if( Input.get('step-duration') == '' ) {
            $2('[name="step-duration"]').addClass('error');
            errors = true;
        }

        if( errors )
            return;

        var id = step.create(params);

        plan.addStep(step);

        var steps = plan.getSteps();

        // Show the steps
        var step_html = '';

        for (var i = 0; i < steps.length; i++) {
            var s           = steps[i],
                startTime   = new Date(s.startTime);

            step_html += new TinyPlanner.StepItem({ model: steps[i]} ).render();
        };

        this.el.querySelector('.plan-steps').innerHTML = step_html;

        // replace the form with the form template
        this.el.querySelector('.new-step-form').innerHTML = _template('add-step');

        // Go back to the plan edit page
        tinyrouter.route('plan/edit/'+plan.id);
    }
});