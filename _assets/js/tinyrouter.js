
'use strict'

/* A tiny router for a tiny planner */
var TinyRouter = Class.extend({

    routes: {
        ''              : 'Plan',
        'plan'          : 'Plan',
        'plan/new'      : 'Plan@new',
        'plan/edit'     : 'Plan@edit',
    },

    init: function() {
        var self = this;

        // Start the initial route.
        this.route(this);

        // Now bind to the hashchange event for all further routing
        window.addEventListener('hashchange', function(e) { self.route(self) }, false);
    },

    /*
        The meat of the router.
    */
    route: function(self) {
        // Get whatever the hash is and remove the actual has char.
        var hash    = window.location.hash.replace('#', ''),
            id      = 0;

        // Check the hash, and see if there's a third argument, which will be an ID. Store the ID.
        if( hash.split('/').length == 3 ) {
            var split = hash.split('/');
            id      = split[2];
            hash    = split[0]+'/'+split[1];
        }
        
        // Look at the app's routes and get any that conform to the hash.
        var route = self.routes[hash];

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

    go: function(location) {
        window.location = '#'+location;
    }
})

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        window.tinyrouter = new TinyRouter;
    }
};
