/*
    Plan Controller.

    Handles all logic for the plans.
*/
'use strict'

var PlanController = BaseController.extend({

    current_plan:   null,
    steps:          [],

    // Constructor
    init: function() {
        //
    },

    // Home page
    index: function() {
        var self = this;

        // Kind of a hacky way to mimic a static function.
        var plans       = (new Plan).findAll();
        var plans_html  = '';

        // If there are plans saved, 
        if( plans.length ) {
            plans_html = '';
            for (var i = 0; i < plans.length; i++) {
                plans_html += '<li class="step"><a href="#plan/edit/'+plans[i].id+'">'+plans[i].title+'</a></li>';
            }
        }
        else {
            plans_html = '<li><p>You haven\'t created any plans yet, but that\'s OK!</p></li>';
        }

        // Show the view
        this.el.innerHTML = _template('plans-index', { plans: plans_html });

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {
                // save the plan
                self.create();
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);

        var ce = function(e) {

            if( e.target.className == 'field' ) {
                // save the plan
                self.create();
            }
        }

        this.loadClickEvents(ce);
    },

    create: function() {
        // Get the inputs
        var title       = Input.get('plan-title'),
            hours       = parseInt(Input.get('plan-hour')),
            minutes     = parseInt(Input.get('plan-minute')),
            meridian    = Input.get('meridian');

        var errors = false;

        // Validation
        if( title == '' ) {
            $2('[name="plan-title"]').addClass('error');
            errors = true;
        }

        if( minutes == NaN ) {
            $2('[name="plan-hour"]').addClass('error');
            errors = true;
        }

        if( minutes == NaN ) {
            $2('[name="plan-minute"]').addClass('error');
            errors = true;
        }

        if( errors )
            return;

        // Final logic
        if( meridian == 'pm' ) {
            hours = hours + 12;
        }

        // Create a new plan object
        var plan = new Plan;

        plan.title = title;
        plan.setEndTime(hours, minutes);

        plan.save();

        this.current_plan = plan;

        // Go to the edit page
        tinyrouter.go('plan/edit/'+plan.id);
    },

    edit: function(id) {
        var self = this;

        // get the plan
        var plan    = (new Plan).find(id);
        var steps   = plan.getSteps();

        plan.updateDuration();
        plan.updateStartTime();

        this.current_plan = plan;

        // Show the edit view
        this.el.innerHTML = _template('plans-edit', {
            title:      plan.title,
            starttime:  plan.startTime.hours    +':'+ ( parseInt(plan.startTime.minutes) < 10 ? '0'+plan.startTime.minutes : plan.startTime.minutes),
            endtime:    plan.endTime.hours      +':'+ ( parseInt(plan.endTime.minutes) < 10 ? '0'+plan.endTime.minutes : plan.endTime.minutes),
            totalduration: plan.getDurationInText()
        });

        // Show the step form
        this.el.querySelector('.new-step-form').innerHTML = _template('add-first-step');

        // Show the steps
        var step_html = '';

        for (var i = 0; i < steps.length; i++) {
            var s = steps[i];
            step_html += _template('step', {
                type: s.type,
                text: s.text,
                duration: s.getDurationInText(),
                starttime: s.type == 'then' ? s.startTime.hours + ':' + (s.startTime.minutes < 10 ? '0'+ s.startTime.minutes : s.startTime.minutes) : ''
            });
        };

        this.el.querySelector('.plan-steps').innerHTML = step_html;

        // replace the form with the form template
        this.el.querySelector('.new-step-form').innerHTML = _template('add-step');


        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {
                // self.saveStep();
                tinyrouter.route('step/create/'+plan.id);
            }
            else return;
        };

        // Load the view events
        this.loadEvents(events);

        var ce = function(e) {
            if( e.target.nodeName.toLowerCase() == 'button' )
                // self.saveStep();
                tinyrouter.route('step/create/'+plan.id);
        }

        this.loadClickEvents(ce);
    },

});