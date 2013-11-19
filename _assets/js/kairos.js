/*
    Kairos.js
*/

'use strict'

var chunk = {
    order:      0,
    type:       '',
    text:       '',
    position:   0
}

var list_obj = {
    title:   '',
    endtime: '',
    chunks:  []
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

    this.deleteStorage = function() {
        var empty = [];
        localStorage.setItem('lists', JSON.stringify({ lists: empty }));
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

            // Submit Events
            $2('.template').addEventListener('submit', function(e) {
                
                // What has been evented?
                var t = e.target.className;
                
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

            // Click events
            $2('.template').addEventListener('click', function(e) {

                var t = e.target.className;
            
                // List form
                if(t == 'begin') {
                    var title   = $2('.add-list-form [name="list"]').value;
                    var endtime = $2('.add-list-form [name="endtime"]').value;

                    var new_list = clone(list_obj);

                    new_list.title      = title;
                    new_list.endtime    = endtime;

                    self.current_list = title;
                    self.storeList(new_list);

                    $2('.template').innerHTML       = $2('.add-first-chunk-template').cloneNode().innerHTML;
                    $2('.editing-list').innerHTML   = self.current_list;
                }

                if(t == 'all-done') {
                    window.location = e.target.href + '?list=' + encodeURI(self.current_list);
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
    this.storeList = function(list) {

        lists.push( list );

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

    /*
    */
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

                if( lists[i].chunks.length ) {
                    chunk.order     = lists[i].chunks.length + 1;
                    chunk.type      = inc == 1 ? 'then' : 'meanwhile';
                    chunk.position  = parseInt(this.getMaxChunkPosition(title)) + parseInt(inc);

                    lists[i].chunks.push( chunk );
                }
                else {
                    chunk.order     = 1;
                    chunk.type      = 'first';
                    chunk.position  = 1;

                    lists[i].chunks = [ chunk ];
                }

                updateStorage();
                return;
            }
        }

    }

    /*
    */
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
    this.showListChunks = function(title, parse) {
        var chunk_html = '';

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var chunks = lists[i].chunks;

                for (var i = 0; i < chunks.length; i++) {
                    var ct = $2('.chunk-template').cloneNode();

                    ct.querySelector('li').setAttribute('class', chunks[i].type);
                    ct.querySelector('.type').innerHTML = chunks[i].type;

                    if( parse ) {
                        var parsed = this.parseString(chunks[i].text);

                        ct.querySelector('.text').innerHTML     = parsed[0];
                        ct.querySelector('.duration').innerHTML = parsed[1]+'m';
                    }
                    else {
                        ct.querySelector('.text').innerHTML = chunks[i].text;
                    }
                    
                    chunk_html += ct.innerHTML;
                }
            }
            
        };

        $2('.chunk-list').innerHTML = '<ul>'+ chunk_html + '</ul>';
    }

    this.showCalculatedListChunks = function(title) {
        var chunk_html = '';

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var chunks = lists[i].chunks;

                this.calculateListChunkTimes(title);

                for (var i = 0; i < chunks.length; i++) {
                    var ct = $2('.chunk-template').cloneNode();

                    ct.querySelector('li').setAttribute('class', chunks[i].type);
                    ct.querySelector('.type').innerHTML = chunks[i].type;

                    var parsed = this.parseString(chunks[i].text);

                    ct.querySelector('.text').innerHTML     = parsed[0];
                    ct.querySelector('.duration').innerHTML = chunks[i].start_time;
                    
                    chunk_html += ct.innerHTML;
                }
            }
            
        };

        $2('.chunk-list').innerHTML = '<ul>'+ chunk_html + '</ul>';
    }

    this.sortListChunks = function(title) {
        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var chunks = lists[i].chunks;

                chunks.sort(function (a, b) {
                    if (a.order > b.order)
                      return 1;
                    if (a.order < b.order)
                      return -1;
                    // a must be equal to b
                    return 0;
                });

                return chunks;
            }
        }
    }

    this.calculateStartTimeMins = function(title) {
        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var sortedchunks = this.sortListChunks(title);
                var total_duration = 0;

                for (var l = 0; l < sortedchunks.length; l++) {

                    if( sortedchunks[l].type == 'then' ) {
                        var parsed_chunk    = this.parseString(sortedchunks[l].text);
                        total_duration      = total_duration + parseInt(parsed_chunk[1]);
                    }
                }

                var parsed_endtime  = this.parseEndTime( lists[i].endtime );
                var endtime_hour    = parsed_endtime.getHours();
                var end_time_mins   = endtime_hour * 60;

                var start_time_mins = end_time_mins - total_duration;

                return start_time_mins;
            }
        }
    }

    this.calculateListChunkTimes = function(title) {

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                var chunks          = lists[i].chunks;
                var parsed_endtime  = this.parseEndTime( lists[i].endtime );

                // Sort the chunks
                var sortedchunks = this.sortListChunks(title);

                // Get the start time in mins
                var start_time_mins = this.calculateStartTimeMins(lists[i].title);

                for (var l = 0; l < sortedchunks.length; l++) {
                    
                    if( sortedchunks[l].type == 'then' ) {
                        var parsed_chunk    = this.parseString(sortedchunks[(l-1)].text);
                        var start_time_mins = start_time_mins + parsed_chunk[1];
                    }

                    var start_hour = Math.floor(start_time_mins / 60);
                    var start_mins = start_time_mins - (start_hour * 60);
                    
                    sortedchunks[l].start_time = start_hour + ':' + (start_mins < 10 ? '0' + start_mins : start_mins);
                }

                lists[i].chunks = sortedchunks;
            }
        }
    }

    /*
    */
    this.parseString = function(str) {
        var new_str         = str.toLowerCase();
        var split           = new_str.split('for');

        if( split.length <= 1 )
            return [split[0], '0'];

        var activity        = split[0];
        var duration_string = split[1];

        var numberwang_array    = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
        var numbers_array       = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,40,50,60,70,80,90];

        for (var i = 0; i < numberwang_array.length; i++) {
            if( duration_string.indexOf(numberwang_array[i]) != -1 ) {
                duration_string = duration_string.replace(numberwang_array[i], numbers_array[i]);
            }
        }

        var duration_int = parseInt(duration_string);

        if( duration_string.match(/h/) ) {
            duration_int = duration_int * 60;
        }
        else if( duration_string.match(/d/) ) {
            duration_int = duration_int * 60 * 24;
        }

        return [activity, duration_int];
    }

    /*
        e.g. number + am/pm
    */
    this.parseEndTime = function(str) {
        var new_str = str.toLowerCase();
        var hour    = parseInt(new_str);

        if( new_str.indexOf('am') == -1 ) {
            hour = hour + 12;
        }

        var end_date = new Date(2000, 1, 1, hour);

        return end_date;
    }

    this.showStartTime = function(title) {

        var start_time_mins = '';

        for (var i = 0; i < lists.length; i++) {
            if( lists[i].title == title ) {
                // Get the start time in mins
                start_time_mins = this.calculateStartTimeMins(lists[i].title);
            }
        }

        var start_hour = Math.floor(start_time_mins / 60);
        var start_mins = start_time_mins - (start_hour * 60);

        $2('.starttime').innerHTML = '<h2>Start at '+ start_hour + ':' + (start_mins < 10 ? '0' + start_mins : start_mins) +'</h2>';
    }


    /* Release the kraken! */
    init();

};
