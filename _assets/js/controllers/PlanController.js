/*
    Plan Controller.

    Handles all logic for the plans.
*/
'use strict'

var PlanController = BaseController.extend({

    plans:          [],
    current_idx:    0,
    steps:          [],

    init: function() {
        this.plans = (new PlanModel).findAll();
    },

    index: function() {
        var self = this;

        // Kind of a hacky way to mimic a static function.
        var plans       = (new PlanModel).findAll();
        var plans_html  = '';

        // If there are plans saved, 
        if( plans.length ) {
            plans_html = '';
            for (var i = 0; i < plans.length; i++) {
                plans_html += '<li class="step"><a href="#plan/edit/'+plans[i].id+'">'+plans[i].title+'</a></li>';
            }
        }
        else {
            plans_html = 'No Plans';
        }

        // Show the view
        this.el.innerHTML = _template('plans-index', { plans: plans_html });

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {

                // save the plan
                var id = self.create();

                // Go to the edit page
                tinyrouter.go('plan/edit/'+id);
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);

        var ce = function(e) {

            if( e.target.className == 'field' ) {
                // save the plan
                var id = self.create();

                // Go to the edit page
                tinyrouter.go('plan/edit/'+id);
            }
        }

        this.loadClickEvents(ce);
    },

    create: function() {
        var order       = this.plans.length + 1,
            title       = $2('[name="plan-title"]').value,
            hour        = $2('[name="plan-hour"]').value,
            minute      = $2('[name="plan-minute"]').value,
            meridian    = $2('[name="meridian"]:checked').value,
            new_plan    = new PlanModel;

        new_plan.create( { title: title, hour: hour, minute: minute, meridian: meridian } );

        this.plans.push( new_plan );
        this.current_idx = (this.plans.length - 1);

        return new_plan.id;
    },

    edit: function(id) {
        var self = this;

        // get the plan
        var plan = (new PlanModel).find(id);

        console.log( plan )

        this.plans.push( plan );
        this.current_idx = 0;

        this.el.innerHTML = _template('plans-edit', {
            title: plan.title,
            starttime: plan.start_time.hours+':'+plan.start_time.minutes,
            endtime: plan.end_time.hours+':'+plan.end_time.minutes,
        });
        this.el.querySelector('.new-step-form').innerHTML = _template('add-first-step');

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {
                self.saveStep();
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);

        var ce = function(e) {
            if( e.target.nodeName.toLowerCase() == 'button' )
                self.saveStep();
        }

        this.loadClickEvents(ce);
    },

    update: function(id) {
        //
    },

    saveStep: function() {
        // Get the plan
        var plan = this.plans[this.current_idx];

        var position_inc = $2('[name="step-type"]:checked') ? $2('[name="step-type"]:checked').value : '';

        console.log(this.plans)
        // Save the step
        // this.plans[this.current_idx].addStep(position_inc, $2('[name="step-title"]').value);

        var params = {
                order:      this.steps.length + 1,
                type:       position_inc == '' ? 'first' : position_inc,
                position:   this.steps.length ? (this.steps[this.steps.length - 1].type == 'meanwhile' ? this.steps[this.steps.length - 1].position + 1 : 1) : 1,
                text:       $2('[name="step-title"]').value,
                duration:   $2('[name="step-duration"]').value,
                unit:       $2('[name="step-unit"]:checked').value
            },
            step = new StepModel;

        step.create(params);

        // step.save();
        this.steps.push( step );

        console.log(step);

        // Show the steps
        var step_html = '';

        for (var i = 0; i < this.steps.length; i++) {
            var s = this.steps[i];
            step_html += _template('step', { type: s.type, text: s.text, duration: (s.duration.hours > 0 ? s.duration.hours + ' hours' : s.duration.minutes + ' minutes') } );
        };

        this.el.querySelector('.plan-steps').innerHTML = step_html;

        // replace the form with the form template
        this.el.querySelector('.new-step-form').innerHTML = _template('add-step');
    },

});