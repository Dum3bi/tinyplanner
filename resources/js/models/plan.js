
(function() {
    'use strict';

    TinyPlanner.Models.Plan = Backbone.Model.extend({

        localStorage: new Backbone.LocalStorage('tiny-plan'),
       
        defaults: function() {
            return {
                title:          '',
                startTime:      (new Date()).getTime(),
                endTime:        (new Date()).getTime(),
                duration: {
                    days:       0,
                    hours:      0,
                    minutes:    0
                },
            };
        },

        getSteps: function() {

            if( this.steps )
                return;
            
            var self = this;


            this.steps = new TinyPlanner.Collections.Steps();
            this.steps.fetch();

            this.steps.forEach(function(step) {
                if( step.get('plan_id') != self.id )
                    self.steps.remove(step);
            });

            this.updateDuration();
            this.updateStartTime();
        },

        removeStep: function(step) {
            this.steps.remove(step);

            this.updateDuration();
            this.updateStartTime();

            this.save();
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
            var st = this.get('startTime');

            this.steps.each(function(step) {
                step.set('startTime', st);

                if( step.get('type') == 'on' ) {
                    st = step.getEndTime();
                }
            });
        },

        getStartTime: function() {
            var time = new Date( this.get('startTime') );
            return (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) +'.'+ (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
        },

        getEndTime: function() {
            var time = new Date( this.get('endTime') );
            return (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) +'.'+ (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
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

            this.set('endTime', start_date.valueOf());
            this.set('startTime', this.endTime);
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
            var text_array = [];

            if (this.get('duration').days > 0) {
                var text = this.get('duration').days + ' day' + (this.get('duration').days > 1 ? 's' : '');
                text_array.push(text);
            }
            if (this.get('duration').hours > 0) {
                var text = this.get('duration').hours + 'h';
                text_array.push(text);
            }
            if (this.get('duration').minutes > 0) {
                var text = this.get('duration').minutes + 'm';
                text_array.push(text);
            }

            return text_array.length ? text_array.join(' ') : 0;
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