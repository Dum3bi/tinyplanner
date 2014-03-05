
(function() {
    'use strict';

    TinyPlanner.Models.Step = Backbone.Model.extend({

        localStorage: new Backbone.LocalStorage('tiny-step'),

        defaults: function() {
            return {
                plan_id:        0,
                text:           '',
                duration: {
                    days:       0,
                    hours:      0,
                    minutes:    0
                },
            };
        },

        setStartTime: function (timeStamp) {
            this.startTime = timeStamp;
        },

        getEndTime: function () {
            // convert duration to milliseconds
            var duration_ms = (this.get('duration').hours * 60 * 60 * 1000) + (this.get('duration').minutes * 60 * 1000),
                endTime_ms  = this.startTime + duration_ms;

            return endTime_ms;
        },

        getDurationInMinutes: function () {
            return (this.get('duration').days * 24 * 60) + (this.get('duration').hours * 60) + this.get('duration').minutes;
        },

        getDurationInHours: function () {
            return this.getDurationInMinutes() / 60;
        },

        getDurationInDays: function () {
            return this.getDurationInHours() / 24;
        },

        getDurationInText: function () {
            var text = '';
            if (this.get('duration').days > 0) {
                text = text + this.duration.days;
                text = text + ' day';
                if (this.get('duration').days > 1) {
                    text = text + 's';
                }
            }
            if (this.get('duration').hours > 0) {
                if (text !== '') {
                    text = text + ', ';
                }
                text = text + this.get('duration').hours;
                text = text + ' hour';
                if (this.get('duration').hours > 1) {
                    text = text + 's';
                }
            }
            if (this.get('duration').minutes > 0) {
                if (text !== '') {
                    text = text + ', ';
                }
                text = text + this.get('duration').minutes;
                text = text + ' minute';
                if (this.get('duration').minutes > 1) {
                    text = text + 's';
                }
            }
            return text;
        },

    });

    // Collection

    TinyPlanner.Collections.Steps = Backbone.Collection.extend({

        model: TinyPlanner.Models.Step,

        localStorage: new Backbone.LocalStorage('tiny-step'),

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