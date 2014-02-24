/*
    Plan Controller.

    Handles all logic for the plans.
*/
var PlanController = TinyMVC.Controller.extend({

    steps: [],

    initialize: function() {
        this.el = $2('.tiny-planner');
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

        var startTime   = new Date(plan.startTime),
            endTime     = new Date(plan.endTime);

        plan.startTime_text  = startTime.getHours()    +':'+ (parseInt(startTime.getMinutes()) < 10    ? '0'+startTime.getMinutes()    : startTime.getMinutes());
        plan.endTime_text    = endTime.getHours()      +':'+ (parseInt(endTime.getMinutes()) < 10      ? '0'+endTime.getMinutes()      : endTime.getMinutes());

        // Render the edit/view... errr... view.
        new TinyPlanner.PlanView({ el: this.el, plan: plan, steps: steps }).render();
    },

});