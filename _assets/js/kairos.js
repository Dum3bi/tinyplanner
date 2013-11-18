/*
    Kairos.js
*/

var Kairos = function() {

    // Init
    if( !localStorage.getItem('lists') ) {
        localStorage.setItem('lists', JSON.stringify({ lists: [] }));
    }

    /*
        Load Listeners
    */
    this.loadListeners = function() {
        var self = this;

        // Events
        if( $2('.add-list') ) {
            $2('.add-list').addEventListener('submit', function(e) {
                self.storeList();
            }, false);
        }


        if( $2('.chunks-form') ) {
            $2('.chunks-form').addEventListener('submit', function(e) {
               self.storeChunk();
                
            }, false);
        }
    }

    /*
        Show Lists
    */
    this.showLists = function() {
        var lists       = JSON.parse( localStorage.getItem('lists') ).lists,
            list_html   = '';

        for (var i = 0; i < lists.length; i++) {
            list_html += '<li><a href="edit.html?list='+lists[i].title+'">' + lists[i].title + '</a></li>';
        };

        $2('.your-lists').innerHTML = '<ul>'+ list_html + '</ul>';
    }

    /*
        Store Chunk
    */
    this.storeList = function() {

        var list_title = $2('.add-list [name="title"]').value;

        var l = JSON.parse( localStorage.getItem('lists') );
        
        l.lists.push( { title: list_title } );

        localStorage.setItem('lists', JSON.stringify(l));
    }

    /*
        Store Chunk
    */
    this.storeChunk = function() {
        var l = JSON.parse( localStorage.getItem('lists') );
        
    }


};
