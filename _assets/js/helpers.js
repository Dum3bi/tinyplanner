/*
    Helpers
*/

'use strict'

function $2(elm) { return document.querySelector(elm) }

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function loadPageVar (sVar) {
    return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function _template(str, obj) {
    var tmpl = $2('#template-'+str).innerHTML;

    if( obj ) 
        return tmpl.replace(/<% ([a-z]+) %>/g, function(str, m1) { return obj[m1] });
    
    return tmpl;
}
