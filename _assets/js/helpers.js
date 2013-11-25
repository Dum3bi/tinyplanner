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
