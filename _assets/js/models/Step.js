/*************
    Step
 *************/

var Step = Model.extend({

    // Global vars
    name:       'tp-step',

    order:      0,
    type:       '',
    position:   0,
    text:       '',
    duration: {
        days:       0,
        hours:      0,
        minutes:    0
    },

    // Init
    init: function(params) {
        this._super();
    },

    create: function(params) {

        this.text   = params.text;
        this.type   = params.type;

        var duration = parseInt(params.duration);

        var hours   = params.unit == 'hours' ? duration : 0,
            minutes = params.unit == 'minutes' ? duration : 0

        this.setDuration(0, hours, minutes);

        this.save();

        return this.id;
    },

    toJSON: function() {
        return { order: this.order, type: this.type, position: this.position, text: this.text, duration: this.duration }
    },

    setDuration: function (days, hours, minutes) {
        days    = days      || 0;
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
        if (hours > 24) {
            days    = days + Math.floor(hours / 24);
            hours   = hours - (days * 24);
        }
        this.duration = {
            days:       days,
            hours:      hours,
            minutes:    minutes
        }
    },

    setStartTime: function (hours, minutes) {
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
        this.startTime = {
            hours:      hours,
            minutes:    minutes
        }
    },

    getEndTime: function () {
        var totalMinutes    = (this.startTime.hours * 60) + this.startTime.minutes + (this.duration.days * 24 * 60) + (this.duration.hours * 60) + this.duration.minutes,
            hours           = Math.floor(totalMinutes / 60),
            minutes         = totalMinutes - (hours * 60);

        if (hours > 24) {
            hours = hours - 24;
        }
        return {
            hours:      hours,
            minutes:    minutes
        };
    },

    getDurationInMinutes: function () {
        return (this.duration.days * 24 * 60) + (this.duration.hours * 60) + this.duration.minutes;
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