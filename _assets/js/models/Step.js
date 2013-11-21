/*
    Step
*/

var Step = function (id) {
    'use strict';

    /*  Private properties */
    var self = this,
        properties = {
            'id': null,
            'order': 0,
            'text': '',
            'type': 'then',
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

    /*  Setters */
    this.setID = function (id) {
        properties.id = id;
        return properties.id;
    };
    this.setOrder = function (num) {
        properties.order = num;
        return properties.order;
    };
    this.setText = function (str) {
        properties.text = str;
        return properties.text;
    };
    this.setType = function (str) {
        properties.type = str;
        return properties.type;
    };
    this.setDuration = function (days, hours, minutes) {
        days = days || 0;
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
        if (hours > 24) {
            days = days + Math.floor(hours / 24);
            hours = hours - (days * 24);
        }
        properties.duration = {
            'days': days,
            'hours': hours,
            'minutes': minutes
        };
        return properties.duration;
    };
    this.setStartTime = function (hours, minutes) {
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
        properties.startTime = {
            'hours': hours,
            'minutes': minutes
        };
        return properties.startTime;
    };

    /*  Getters */
    this.getID = function () {
        return properties.id;
    };
    this.getOrder = function () {
        return properties.order;
    };
    this.getText = function () {
        return properties.text;
    };
    this.getType = function () {
        return properties.type;
    };
    this.getDuration = function () {
        return properties.duration;
    };
    this.getStartTime = function () {
        return properties.startTime;
    };
    this.getEndTime = function () {
        var totalMinutes = (properties.startTime.hours * 60) + properties.startTime.minutes + (properties.duration.days * 24 * 60) + (properties.duration.hours * 60) + properties.duration.minutes,
            hours = Math.floor(totalMinutes / 60),
            minutes = totalMinutes - (hours * 60);
        if (hours > 24) {
            hours = hours - 24;
        }
        return {
            'hours': hours,
            'minutes': minutes
        };
    };
    this.getDurationInMinutes = function () {
        var minutes = (properties.duration.days * 24 * 60) + (properties.duration.hours * 60) + properties.duration.minutes;
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

    return init();

};

/****** Old ******/

var StepModel = Model.extend({

    // Global vars
    name:       'tp-step',

    order:      0,
    type:       '',
    position:   0,
    text:       '',
    duration: {
        days: 0,
        hours: 0,
        minutes: 0
    },

    // Init
    init: function(params) {
        this._super();
    },

    create: function(params) {

        this.text   = params.text;
        this.type   = params.type;

        var duration    = parseInt(params.duration),
            step        = new Step;

        console.log(params.unit);

        this.duration = {
            days:       0,
            hours:      params.unit == 'hours' ? duration : 0,
            minutes:    params.unit == 'minutes' ? duration : 0
        }

        this.save();

        return this.id;
    },

    toJSON: function() {
        return { order: this.order, type: this.type, position: this.position, text: this.text }
    }

});