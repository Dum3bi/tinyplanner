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
