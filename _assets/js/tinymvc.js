/*
    TinyMVC.js

    A tinymvc for a tiny planner

    @author  Graham Smith <g@blaxian.com>
    @license MIT
    @version 0.1
*/

/*
    tinyrouter.js
    A tiny router for a tiny planner.
*/
(function() {
    'use strict'

    /* A tiny router for a tiny planner */
    var tinyrouter = function(routes) {
        
        var routes = routes || {};

        function init() {
            var self = this;

            // Seriously, if the browser can't support these functions then it's not worth bothering with.
            if( !document.querySelector && !window.addEventListener && !window.localStorage ) {
                document.body.innerHTML = '<div style="padding: 30px 15px"><h1>Tiny Planner</h1><h2>Whoa, whoa... WHOA.</h2><p>This browser is ooooooooold. And, subsequently, unsupported.</p></div>';
                return;
            }

            // Start the initial route.
            route();

            // Now bind to the hashchange event for all further routing
            window.addEventListener('hashchange', function(e) { route() });
        }

        /*
            The meat of the router.
        */
        function route(hash) {
            if( !hash ) {
                hash = window.location.hash.replace('#', '');
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
            var route = routes[hash];

            // If a route for that hash has been defined, load it.
            if( route !== undefined ) {
                // Get the controller name and function
                var arr = route.match(/(\w+)@?(\w+)?/);

                // We found a controller
                if( arr.length ) {
                    var str = arr[1]+'Controller',
                        controller = new window[str];

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
        }

        /*
            e.g. tinyrouter.go('controller/view')
        */
        function go(location) {
            window.location = '#'+location;
        }

        init();

        return {
            route: function(hash) {
                route(hash);
            },
            go: function(location) {
                go(location);
            }
        }

    }

    window.tinyrouter = tinyrouter;
})();

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

(function() {
    'use strict'
    
    var TinyMVC = {};

    TinyMVC.Class = Class.extend({

        el: $2('body'),

        init: function(args) {
            if( args && typeof args == 'object' ) {
                for( var prop in args ) {
                    this[prop] = args[prop];
                }
            }

            if( this.initialize ) {
                this.initialize();
            }
        }
    })

    TinyMVC.Controller = TinyMVC.Class.extend({
        
        init: function(args) {
            this._super(args);

            // remove bound events
            // var old_element = this.el;
            // var new_element = old_element.cloneNode(true);
            // old_element.parentNode.replaceChild(new_element, old_element);

            // this.el = new_element;
        }
    });

    /*
        Model
    */

    TinyMVC.Model = TinyMVC.Class.extend({

        name:   '',
        id:     null,

        init: function(args) {
            this._super(args);

            this.store      = localStorage.getItem(this.name) || '';
            this.records    = (this.store && this.store.split(",")) || [];
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

                return ( Object.create(this) );
            }, this);
        },

        fromJSON: function(json) {
            for( var prop in json ) {
                this[prop] = json[prop];
            }

            return this;
        },

    });


    /*
        TinyMVC View

        These take on a dual purpose. While all views function in the same way, they can be used for two main ideas.

        1.  A view controller, so to speak. A collection of smaller view or partials. You could have a view for the Home Page, for instance, but that view is made up of several smaller views, maybe a header, a footer, and main area (which could be further sub-divided).
            One view can simply be created to manage the partials.

            HomePage = TinyMVC.View.extend({
                
                render: function() {
                    var view = '';
                    
                    // Collect the subviews.
                    view += new subView().render();
                    view += new subView2().render();

                    this.el.innerHTML = view;
                }
            });

        2.  Partials.
            The smaller elements of a 'page'. Where certain logic and events are more tightly coupled, like a form.

            e.g.


            MyForm = TinyMVC.View.extend({

                events: {
                    'click': 'myEvent'
                },

                myEvent: function(e) {
                    // do stuff
                },

                render: function() {
                    return _template('my-form');
                }
            });

            var myForm = new MyForm.render();

        You also do not need to use a TinyMVC.View to render a view. These are merely for convenience to group logic. You bypass it all and use _template directly:
        var view = '';
        view += _template('my-template', { var: 'myVar' });
    */
    TinyMVC.View = TinyMVC.Class.extend({

        tagName: 'div',
        template: '',

        events: {},

        init: function(args) {
            this._super(args);

            if( Object.keys(this.events).length ) {
                for(var prop in this.events) {
                    var ev  = prop.split(' ')[0],
                        elm = prop.split(' ')[1] || null;

                    if( elm ) {
                        var self = this;

                        this.el.addEventListener(ev, function(e) {
                            var current_elm = e.target;
                            var re          = new RegExp('\\b'+elm.replace('.', '')+'\\b');

                            while( current_elm != this.el && current_elm.nodeName != 'body' ) {
                                if( re.test(current_elm.classList) )
                                    self[self.events[prop]](e);

                                current_elm = current_elm.parentNode;
                            }
                        }, false);
                    }
                    else {
                        this.el.addEventListener(prop, this[this.events[prop]].bind(this), false);
                    }
                }
            }
        }

    });


    window.TinyMVC = TinyMVC;
})(this);
