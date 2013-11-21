/*
    Plan
*/

var Plan = function (id) {
    'use strict';

    /*  Private properties */
    var self = this,
        properties = {
            'id': null,
            'title': '',
            'steps': [],
            'startTime':  {
                'days': 0,
                'hours': 0,
                'minutes': 0
            },
            'endTime': {
                'hours': 0,
                'minutes': 0
            },
            'duration': {
                'days': 0,
                'hours': 0,
                'minutes': 0
            }
        },
        init = function () {
            if (id) {
                return self.setID(id);
            }
        };

    /*  Private methods */
    var orderSteps = function () {
            properties.steps.sort(function (a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }
                return 0;
            });
            return properties.steps;
        },
        updateDuration = function () {
            var days,
                hours,
                minutes,
                totalminutes = self.getDurationInMinutes();
            hours = Math.floor(totalminutes / 60);
            minutes = totalminutes - (hours * 60);
            days = Math.floor(hours / 24);
            if (days > 0) {
                hours = hours - (days * 24);
            }
            properties.duration = {
                'days': days,
                'hours': hours,
                'minutes': minutes
            };
            return properties.duration;
        },
        updateStartTime = function () {
            var days = 0,
                hours = 0,
                minutes = 0,
                startminutes = ((properties.endTime.hours * 60) + properties.endTime.minutes) - self.getDurationInMinutes();
            if (startminutes < 0) {
                startminutes = 0 - startminutes;
                days = Math.floor((startminutes / 60) / 24);
                hours = Math.floor(((1 - (((startminutes / 60) / 24) - days)) * 60 * 24) / 60);
                minutes = Math.round(((1 - (((startminutes / 60) / 24) - days)) * 60 * 24) - (hours * 60));
            } else {
                hours = Math.floor(startminutes / 60);
                minutes = startminutes - (Math.floor(startminutes / 60) * 60);
            }
            properties.startTime = {
                'days': days,
                'hours': hours,
                'minutes': minutes
            };
            return properties.startTime;
        };

    /*  Setters */
    this.setID = function (id) {
        properties.id = id;
        return properties.id;
    };
    this.setTitle = function (str) {
        properties.title = str;
        return properties.title;
    };
    this.setSteps = function (arr) {
        properties.steps = arr;
        orderSteps();
        updateStartTime();
        return properties.steps;
    };
    this.setEndTime = function (hours, minutes) {
        hours = hours || 0;
        minutes = minutes || 0;
        if (hours !== Math.round(hours)) {
            minutes = minutes + ((hours - Math.floor(hours)) * 60);
            hours = Math.floor(hours);
        }
        if (minutes > 60) {
            hours = hours + Math.floor(minutes / 60);
            minutes = minutes - (Math.floor(minutes / 60) * 60);
        }
        properties.endTime = {
            'hours': hours,
            'minutes': minutes
        };
        updateStartTime();
        return properties.endTime;
    };

    /*  Getters */
    this.getID = function () {
        return properties.id;
    };
    this.getTitle = function () {
        return properties.title;
    };
    this.getSteps = function () {
        return properties.steps;
    };
    this.getStartTime = function () {
        return properties.startTime;
    };
    this.getEndTime = function () {
        return properties.endTime;
    };
    this.getDuration = function () {
        return properties.duration;
    };
    this.getDurationInMinutes = function () {
        var minutes = 0,
            step,
            stepminutes = 0,
            lasttally = 0,
            i,
            count = properties.steps.length;
        for (i = 0; i < count; i = i + 1) {
            step = properties.steps[i];
            stepminutes = step.getDurationInMinutes();
            if (step.type !== 'meanwhile') {
                minutes = minutes + stepminutes;
                lasttally = stepminutes;
            } else {
                if (stepminutes > lasttally) {
                    minutes = minutes + (stepminutes - lasttally);
                    lasttally = stepminutes;
                }
            }
        }
        return minutes;
    };
    this.getDurationInHours = function () {
        var minutes = self.getDurationInMinutes(),
            hours = minutes / 60;
        return hours;
    };
    this.getDurationInDays = function () {
        var hours = self.getDurationInHours(),
            days = hours / 24;
        return days;
    };
    this.getDurationinText = function () {
        var text = '';
        if (properties.duration.days > 0) {
            text = text + properties.duration.days;
            text = text + ' day';
            if (properties.duration.days > 1) {
                text = text + 's';
            }
        }
        if (properties.duration.hours > 0) {
            if (text !== '') {
                text = text + ', ';
            }
            text = text + properties.duration.hours;
            text = text + ' hour';
            if (properties.duration.hours > 1) {
                text = text + 's';
            }
        }
        if (properties.duration.minutes > 0) {
            if (text !== '') {
                text = text + ', ';
            }
            text = text + properties.duration.minutes;
            text = text + ' minute';
            if (properties.duration.minutes > 1) {
                text = text + 's';
            }
        }
        return text;
    };

    /*  Public methods */
    this.addStep = function (step) {
        if (step.getOrder() < 1) {
            step.setOrder(properties.steps.length + 1);
        }
        properties.steps.push(step);
        orderSteps();
        updateDuration();
        updateStartTime();
        return properties.steps;
    };
    this.toJSON = function() {
        var json = JSON.stringify(properties);
        return json;
    };
    this.fromJSON = function(json) {
        properties = json;
        return properties;
    };

    return init();

};



/****** Old *******/

var PlanModel = Model.extend({

    // Global vars
    name:  'tp-plan',

    id: null,
    title: '',
    steps: [],
    startTime:  {
        days: 0,
        hours: 0,
        minutes: 0
    },
    endTime: {
        hours: 0,
        minutes: 0
    },
    duration: {
        days: 0,
        hours: 0,
        minutes: 0
    },

    // Init
    init: function(order, title, endtime) {
        this._super();

        this.title = title;
    },

    create: function(params) {

        this.title = params.title;

        var hour    = parseInt(params.hour),
            minute  = parseInt(params.minute),
            plan    = new Plan;

        if( params.meridian == 'pm' ) {
            hour = hour + 12;
        }

        console.log( hour + ' : ' +minute );

        plan.setEndTime(hour, minute);

        this.startTime = plan.getStartTime();
        this.endTime = plan.getEndTime();

        console.log( plan.getStartTime() )

        this.save();

        return this.id;
    },

    //
    addStep: function(type, text) {
        var params = {
                order:      this.steps.length + 1,
                type:       type == '' ? 'first' : type,
                position:   this.steps.length ? (this.steps[this.steps.length - 1].type == 'meanwhile' ? this.steps[this.steps.length - 1].position + 1 : 1) : 1,
                text:       text
            },
            step = new Step(params);

        step.save();
        this.steps.push( step );
    },

    //
    removeStep: function(idx) {
        this.steps.splice(idx, 1);
    },

    //
    getSteps: function(id) {
        var plan        = JSON.parse(localStorage.getItem(this.name+"-"+id)),
            step_ids    = plan.steps.split(','),
            steps       = [];

        for (var i = 0; i < step_ids.length; i++) {
            steps.push( localStorage.getItem(step_ids[i]) );
        }

        return steps;
    },

    toJSON: function() {
        return { title: this.title, start_time: this.startTime, end_time: this.endTime }
    }
});
