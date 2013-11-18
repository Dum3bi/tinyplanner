/*
    Kairos.js
*/

var chunk = {
    text:       '',
    position:   0,
    endTime:    ''
}

var Kairos = function() {

    var lists           = [],
        current_list    = '';

    var init = function() {
        // Init
        if( !localStorage.getItem('lists') ) {
            updateStorage();
        }

        lists = JSON.parse( localStorage.getItem('lists') ).lists;
    }

    var updateStorage = function() {
        localStorage.setItem('lists', JSON.stringify({ lists: lists }));
    }

    /*
        Load Listeners
    */
    this.loadListeners = function() {
        // THIS IS ME.
        var self = this;

        // Is there an element with a class of template? If so... ACTION.
        if( $2('.template') ) {

            $2('.template').addEventListener('submit', function(e) {
                
                // What has been evented?
                var t = e.target.className;
                
                // List form
                if(t == 'add-list-form') {
                    var title = $2('.add-list-form [name="list"]').value;

                    self.current_list = title;
                    self.storeList(title);

                    $2('.template').innerHTML = $2('.add-first-chunk-template').cloneNode().innerHTML;
                    $2('.editing-list').innerHTML = self.current_list;
                }

                // Chunk Form
                if(t == 'add-chunk-form') {

                    // parse the chunk
                    var text        = $2('.add-chunk-form [name="chunk"]').value,
                        chunk_obj   = clone(chunk);

                    chunk_obj.text = text;

                    // get the list
                    var list = self.current_list;

                    if( list == '' )
                        list = $2('.add-chunk-form [name="list"]').value;

                    // 
                    var select          = $2('.add-chunk-form [name="position"]'),
                        position_inc    = select.options[select.selectedIndex].value;

                    self.storeChunk(list, chunk_obj, position_inc);

                    // replace the current chunk form so we can redo the listeners
                    $2('.template').innerHTML       = $2('.add-chunk-template').cloneNode().innerHTML;
                    $2('.editing-list').innerHTML   = self.current_list;

                    self.showListChunks(list);
                }

                // End time
                if(t == 'endtime-form') {
                    var endtime = $2('.endtime-form [name="endtime"]').value;

                    // get the list
                    var list = $2('.endtime-form [name="list"]').value;

                    self.storeEndtime(list, endtime);
                }

                e.preventDefault();

            }, false);
            
        }
    }

    /*
        Show Lists
    */
    this.showLists = function() {
        var list_html   = '';

        for (var i = 0; i < lists.length; i++) {
            list_html += '<li><a href="view.html?list='+lists[i].title+'">' + lists[i].title + '</a></li>';
        };

        $2('.your-lists').innerHTML = '<ul>'+ list_html + '</ul>';
    }

    /*
        Store Chunk
    */
    this.storeList = function(title) {

        lists.push( { title: title } );

        updateStorage();
    }

    /*
        Find list

        loops through the JSON and picks out the required list
    */
    this.findList = function(title) {
        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                return lists[i];
            }
        }

        return false;
    }

    this.storeEndtime = function(title, endtime) {
        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                lists[i].endTime = endtime;
            }
        }

        updateStorage();
    }

    /*
    */
    this.getListEndTime = function(title) {
        var list;

        if( list = this.findList(title) ) {
            if( list.endTime ) {
                return list.endTime;
            }
        }

        return false;
    }

    /*
        Store Chunk
    */
    this.storeChunk = function(title, chunk, inc) {

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                if( lists[i].chunks ) {

                    chunk.position = parseInt(this.getMaxChunkPosition(title)) + parseInt(inc);
                    lists[i].chunks.push( chunk );
                }
                else {
                    chunk.position = 1;
                    lists[i].chunks = [ chunk ];
                }

                updateStorage();
                return;
            }
        }

    }

    this.getMaxChunkPosition = function(title) {
        var maxPos = 0;

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                if( lists[i].chunks ) {
                    var chunks = lists[i].chunks;

                    for (var c = 0; c < chunks.length; c++) {
                        if( chunks[c].position > maxPos )
                            maxPos = chunks[c].position;
                    }
                }

                return maxPos;
            }
        }

        return maxPos;
    }

    /*
        Show Lists
    */
    this.showListChunks = function(title) {
        var chunk_html = '';

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var chunks = lists[i].chunks;

                for (var i = 0; i < chunks.length; i++) {
                    chunk_html += '<li>' + chunks[i].text + '</li>';
                }
            }
            
        };

        $2('.chunk-list').innerHTML = '<ul>'+ chunk_html + '</ul>';
    }


    init();

};
