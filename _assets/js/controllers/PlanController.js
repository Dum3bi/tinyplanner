/*
    Plan Controller.

    Handles all logic for the plans.
*/
var PlanController = TinyMVC.Controller.extend({

    // current_plan:   null,
    steps:          [],

    initialize: function() {
        this.el = $2('.tiny-planner');
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
                plans_html += _template('plan', { id: plans[i].id, title: plans[i].title });
            }
        }
        else {
            plans_html = '<div><p>You haven’t created any plans yet, but that’s OK!</p></div>';
        }

        // Show the view
        this.el.innerHTML = _template('plans-index');
        this.el.querySelector('.plans').innerHTML = plans_html;

        // Create the view events
        var events = function(e) {
            if( e.keyCode == 13 ) {
                // save the plan
                self.create();
            }
            else
                return;
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

        // Create a new plan object
        var plan = new Plan;

        plan.title = title;
        plan.setEndTime(hours, minutes);

        plan.save();

        // this.current_plan = plan;

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

        // this.current_plan = plan;

        var startTime   = new Date(plan.startTime);
        var endTime     = new Date(plan.endTime);

        // Show the edit view
        this.el.innerHTML = _template('plans-edit', {
            title:      plan.title,
            starttime:  startTime.getHours()    +':'+ (parseInt(startTime.getMinutes()) < 10    ? '0'+startTime.getMinutes()    : startTime.getMinutes()),
            endtime:    endTime.getHours()      +':'+ (parseInt(endTime.getMinutes()) < 10      ? '0'+endTime.getMinutes()      : endTime.getMinutes()),
            totalduration: plan.getDurationInText()
        });

        // Show the step form
        this.el.querySelector('.new-step-form').innerHTML = _template('add-first-step');

        // Show the steps
        var step_html = '';

        for (var i = 0; i < steps.length; i++) {
            var s           = steps[i],
                startTime   = new Date(s.startTime);

            step_html += _template('step', {
                type: s.type,
                text: s.text,
                duration: s.getDurationInText(),
                starttime: s.type == 'then' ? startTime.getHours() + ':' + (parseInt(startTime.getMinutes()) < 10 ? '0'+startTime.getMinutes() : startTime.getMinutes()) : ''
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