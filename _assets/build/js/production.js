/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
//http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();
/*
    Helpers
*/

'use strict'

function $2(elm) { return document.querySelector(elm) }

HTMLInputElement.prototype.style        = function(s, t) { if(arguments[1]) { this.style[s] = t; return this; } else { return window.getComputedStyle(this)[s]; } }
HTMLInputElement.prototype.addClass     = function (c) { var arr = []; if(this.getAttribute('class')) { arr = this.getAttribute('class').replace(/[\s]{2}/, ' ').split(' '); arr.push(c); } else { arr = [c] } this.setAttribute('class', arr.join(' ')); }
HTMLInputElement.prototype.removeClass  = function (c) { var arr = [], idx; if(this.getAttribute('class')) { arr = this.getAttribute('class').replace(/[\s]{2}/, ' ').split(' '); idx = arr.indexOf(c); if(idx != -1) { arr.splice(idx); this.setAttribute('class', arr.join(' ')); } } }

HTMLTextAreaElement.prototype.addClass = HTMLInputElement.prototype.addClass;
HTMLTextAreaElement.prototype.removeClass = HTMLInputElement.prototype.removeClass;

function _template(str, obj) {
    var tmpl = $2('#template-'+str).innerHTML;

    if( obj ) 
        return tmpl.replace(/<% ([a-z]+) %>/g, function(str, m1) { return obj[m1] });
    
    return tmpl;
}

var Input = new Object();

Input.get = function(input) {
    var input = ( $2('[name="'+input+'"]:checked') || $2('[name="'+input+'"]') );
    
    if( input )
        return input.value;

    return '';
}

/*
    Model

    The base model class
*/

var Model = Class.extend({

    name:       'tp-model',

    id:         null,
    store:      null,
    records:    [],

    // Init
    init: function() {
        this.store = localStorage.getItem(this.name);
        this.records = (this.store && this.store.split(",")) || [];
    },

    // Generate four random hex digits.
    S4: function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    guid: function() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    },

    create: function(json) {

        this.fromJSON(json);
        this.save();

        return this.id;
    },

    save: function() {
        // Need a way to use other DB 'engines'. For now, localStorage.
        var obj = this.toJSON();
        
        if( this.id ) {
            obj.id = this.id;
        }
        else {
            obj.id  = this.guid();
            this.id = obj.id;

            this.records.push(obj.id);
            localStorage.setItem(this.name, this.records.join(","));
        }

        localStorage.setItem(this.name+'-'+obj.id, JSON.stringify(obj));

        return this.id;
    },

    find: function(id) {
        var json    = JSON.parse(localStorage.getItem(this.name+"-"+id));

        // convert the saved json data into the object itself as class properies.
        this.fromJSON(json);

        return this;
    },

    findAll: function() {
        return this.records.map(function(id) {
            var json = JSON.parse(localStorage.getItem(this.name+"-"+id));
            this.fromJSON(json);
            return this;
        }, this);
    },

    fromJSON: function(json) {
        for( var prop in json ) {
            this[prop] = json[prop];
        }

        return this;
    }

});

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
/*
    Base Controller.

    Underlying logic/properties for all further classes.
*/
'use strict'

var BaseController = Class.extend({

    el:         $2('.tiny-planner'),
    events:     [],

    //
    loadEvents: function(events) {
        for (var i = 0; i < this.events.length; i++) {
            this.el.removeEventListener('keypress', this.events[i], false);
        };
        this.el.addEventListener('keypress', events, false);
        this.events.push(events);
    },

    //
    loadClickEvents: function(events) {
        for (var i = 0; i < this.events.length; i++) {
            this.el.removeEventListener('click', this.events[i], false);
        };
        this.el.addEventListener('click', events, false);
        this.events.push(events);
    },
});
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
/*
    Step Controller.

    Handles all logic for the steps.
*/
'use strict'

var StepController = BaseController.extend({

    create: function(id) {
        // Get the plan
        var plan = (new Plan).find(id);

        var position_inc = $2('[name="step-type"]:checked') ? $2('[name="step-type"]:checked').value : '';

        var params = {
                order:      0,
                type:       position_inc == '' ? 'first' : position_inc,
                position:   0, //this.steps.length ? (this.steps[this.steps.length - 1].type == 'meanwhile' ? this.steps[this.steps.length - 1].position + 1 : 1) : 1,
                text:       Input.get('step-title'),
                duration:   parseInt(Input.get('step-duration')),
                unit:       Input.get('step-unit')
            },
            step = new Step;

        // Validation
        var errors = false;

        // Remove any error classes from previous attempts.
        $2('[name="step-title"]').removeClass('error');
        $2('[name="step-duration"]').removeClass('error');

        if( Input.get('step-title') == '' ) {
            $2('[name="step-title"]').addClass('error');
            errors = true;
        }

        if( Input.get('step-duration') == '' ) {
            $2('[name="step-duration"]').addClass('error');
            errors = true;
        }

        if( errors )
            return;

        var id = step.create(params);

        plan.addStep(step);

        var steps = plan.getSteps();

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

        // Go back to the plan edit page
        tinyrouter.route('plan/edit/'+plan.id);
    }
});

'use strict'

/* A tiny router for a tiny planner */
var TinyRouter = Class.extend({

    routes: {
        ''              : 'Plan',
        'plan'          : 'Plan',
        'plan/new'      : 'Plan@new',
        'plan/edit'     : 'Plan@edit',
        'step/create'   : 'Step@create',
    },

    init: function() {
        var self = this;

        // Start the initial route.
        this.route();

        // Now bind to the hashchange event for all further routing
        window.addEventListener('hashchange', function(e) { self.route() }, false);
    },

    /*
        The meat of the router.
    */
    route: function(hash) {
        if( !hash ) {
            hash    = window.location.hash.replace('#', '');
        }

        // Get whatever the hash is and remove the actual has char.
        var id  = 0;

        // Check the hash, and see if there's a third argument, which will be an ID. Store the ID.
        if( hash.split('/').length == 3 ) {
            var split = hash.split('/');
            id      = split[2];
            hash    = split[0]+'/'+split[1];
        }

        // Look at the app's routes and get any that conform to the hash.
        var route = this.routes[hash];

        // If a route for that hash has been defined, load it.
        if( route !== undefined ) {
            // Get the controller name and function
            var arr = route.match(/(\w+)@?(\w+)?/);

            // We found a controller
            if( arr.length ) {
                var str = arr[1]+'Controller';
                var controller = new window[str];

                // We also found a method
                if( arr[2] ) {
                    if( controller[arr[2]] )
                        controller[arr[2]](id);
                }
                // Otherwise load the index
                else {
                    if( controller['index'] )
                        controller.index();
                }
            }
        }
    },

    /*
        e.g. tinyrouter.go('controller/view')
    */
    go: function(location) {
        window.location = '#'+location;
    }
})

// Load the class on document ready.
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        window.tinyrouter = new TinyRouter;
    }
};
