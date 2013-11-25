/*
    Plan
*/

/****** Old *******/

var Plan = Model.extend({

    // Global vars

    // Set the name of the 'DB row'.
    name:           'tp-plan',

    id:             null,
    title:          '',
    steps:          [],
    startTime:  {
        days:       0,
        hours:      0,
        minutes:    0
    },
    endTime: {
        hours:      0,
        minutes:    0
    },
    duration: {
        days:       0,
        hours:      0,
        minutes:    0
    },

    // Init
    init: function() {
        this._super();
    },

    //
    addStep: function(step) {
        
        if( this.steps.constructor != Array )
            this.steps = this.getSteps();

        this.steps.push(step);
        
        this.updateDuration();
        this.updateStartTime();

        this.save();
    },

    //
    removeStep: function(idx) {
        this.steps.splice(idx, 1);
    },

    //
    getSteps: function() {
        if( this.steps.constructor != Array ) {
            var step_ids    = this.steps.split(','),
                steps       = [];

            for (var i = 0; i < step_ids.length; i++) {
                if( step_ids[i] == '' ) {
                    continue;
                }

                var step = (new Step).find( step_ids[i] );
                steps.push( step );
            }

            this.steps = steps;
        }

        return this.steps;
    },

    toJSON: function() {
        var step_ids = [];

        for (var i = 0; i < this.steps.length; i++) {
            step_ids.push(this.steps[i].id);
        }

        return { title: this.title, startTime: this.startTime, endTime: this.endTime, steps: step_ids.join(',') }
    },

    updateDuration: function () {
        var days,
            hours,
            minutes,
            totalminutes = this.getDurationInMinutes();

        hours   = Math.floor(totalminutes / 60);
        minutes = totalminutes - (hours * 60);
        days    = Math.floor(hours / 24);
        
        if (days > 0) {
            hours = hours - (days * 24);
        }

        this.duration = {
            days:       days,
            hours:      hours,
            minutes:    minutes
        }
    },

    updateStartTime: function () {
        var days            = 0,
            hours           = 0,
            minutes         = 0,
            startminutes    = ((this.endTime.hours * 60) + this.endTime.minutes) - this.getDurationInMinutes();

        if (startminutes < 0) {
            startminutes = 0 - startminutes;
            days    = Math.floor((startminutes / 60) / 24);
            hours   = Math.floor(((1 - (((startminutes / 60) / 24) - days)) * 60 * 24) / 60);
            minutes = Math.round(((1 - (((startminutes / 60) / 24) - days)) * 60 * 24) - (hours * 60));
        } else {
            hours   = Math.floor(startminutes / 60);
            minutes = startminutes - (Math.floor(startminutes / 60) * 60);
        }

        this.startTime = {
            days:       days,
            hours:      hours,
            minutes:    minutes
        }

        var sh = this.startTime.hours,
            sm = this.startTime.minutes;

        // Now update the step start times.
        for (var i = 0; i < this.steps.length; i++) {
            this.steps[i].setStartTime(sh, sm);

            if( this.steps[i].type == 'then' ) {
                var et = this.steps[i].getEndTime();

                sh = et.hours;
                sm = et.minutes;
            }
        }

    },

    setEndTime: function (hours, minutes) {
        hours   = hours     || 0;
        minutes = minutes   || 0;

        if (hours !== Math.round(hours)) {
            minutes = minutes + ((hours - Math.floor(hours)) * 60);
            hours   = Math.floor(hours);
        }
        if (minutes > 60) {
            hours   = hours + Math.floor(minutes / 60);
            minutes = minutes - (Math.floor(minutes / 60) * 60);
        }

        this.endTime = {
            hours:      hours,
            minutes:    minutes
        }

        this.updateStartTime();
    },

    getDurationInMinutes: function () {
        var minutes     = 0,
            step,
            stepminutes = 0,
            lasttally   = 0,
            i,
            count       = this.steps.length;

        for (i = 0; i < count; i = i + 1) {
            step        = this.steps[i];
            stepminutes = step.getDurationInMinutes();

            if (step.type !== 'meanwhile') {
                minutes     = minutes + stepminutes;
                lasttally   = stepminutes;
            } else {
                if (stepminutes > lasttally) {
                    minutes     = minutes + (stepminutes - lasttally);
                    lasttally   = stepminutes;
                }
            }
        }
        return minutes;
    },

    getDurationInHours: function () {
        return this.getDurationInMinutes() / 60;
    },

    getDurationInDays: function () {
        return this.getDurationInHours() / 24;
    },

    getDurationInText: function () {
        var text = '';

        if (this.duration.days > 0) {
            text = text + this.duration.days;
            text = text + ' day';
            if (this.duration.days > 1) {
                text = text + 's';
            }
        }
        if (this.duration.hours > 0) {
            if (text !== '') {
                text = text + ', ';
            }
            text = text + this.duration.hours;
            text = text + ' hour';
            if (this.duration.hours > 1) {
                text = text + 's';
            }
        }
        if (this.duration.minutes > 0) {
            if (text !== '') {
                text = text + ', ';
            }
            text = text + this.duration.minutes;
            text = text + ' minute';
            if (this.duration.minutes > 1) {
                text = text + 's';
            }
        }
        return text;
    },
});
