
(function() {
    'use strict';

    TinyPlanner.Models.Plan = Backbone.Model.extend({

        localStorage: new Backbone.LocalStorage('tiny-plan'),
       
        defaults: function() {
            return {
                title:          '',
                step_ids:       [],
                startTime:      0,
                endTime:        0,
                duration: {
                    days:       0,
                    hours:      0,
                    minutes:    0
                },
            };
        },

        getSteps: function() {

            this.steps = new TinyPlanner.Collections.Steps();

            if( this.get('step_ids').length ) {
                var steps_array = [];

                this.get('step_ids').forEach(function(id) {
                    var step = new TinyPlanner.Models.Step();
                    step.id = id;
                    step.fetch();

                    steps_array.push(step);
                });

                var steps_collection = new TinyPlanner.Collections.Steps(steps_array);

                this.steps = steps_collection;
            }

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

            this.set('duration', {
                days:       days,
                hours:      hours,
                minutes:    minutes
            });
        },

        updateStartTime: function () {

            this.set('startTime', this.get('endTime') - ( this.getDurationInMinutes() * 60 * 1000 ) );

            // Now update the step start times.
            var st = this.startTime;

            this.steps.each(function(step) {
                step.setStartTime(st);

                if( step.get('type') == 'on' ) {
                    st = step.getEndTime();
                }
            });
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

            var current_date    = new Date();
            var start_date      = new Date( current_date.getFullYear(), current_date.getMonth(), current_date.getDate(), hours, minutes, current_date.getSeconds() );

            this.endTime    = start_date.valueOf();
            this.startTime  = this.endTime;
        },

        getDurationInMinutes: function () {
            var minutes     = 0,
                step,
                stepminutes = 0,
                lasttally   = 0,
                i;

            this.steps.each(function(step) {

                stepminutes = step.getDurationInMinutes();

                if (step.type !== 'off') {
                    minutes     = minutes + stepminutes;
                    lasttally   = stepminutes;
                } else {
                    if (stepminutes > lasttally) {
                        minutes     = minutes + (stepminutes - lasttally);
                        lasttally   = stepminutes;
                    }
                }
            }, this)

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

    // Collection

    TinyPlanner.Collections.Plans = Backbone.Collection.extend({
        
        model: TinyPlanner.Models.Plan,

        localStorage: new Backbone.LocalStorage('tiny-plan'),

        nextOrder: function() {
            if ( !this.length ) {
                return 1;
            }

            return this.last().get('order') + 1;
        },

        comparator: function( plan ) {
            return plan.get('order');
        }
    });

})();