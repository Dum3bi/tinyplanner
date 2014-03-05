/*
    Helpers
*/

'use strict'

function $2(elm) { return document.querySelector(elm) }

HTMLInputElement.prototype.style        = function(s, t) { if(arguments[1]) { this.style[s] = t; return this; } else { return window.getComputedStyle(this)[s]; } }
HTMLInputElement.prototype.addClass     = function (c) { if (this.classList) this.classList.add(c); else this.className += ' ' + className; }
HTMLInputElement.prototype.removeClass  = function (c) { if (this.classList) this.classList.remove(c); else { var arr = [], idx; arr = this.className.replace(/[\s]{2}/, ' ').split(' '); idx = arr.indexOf(c); if(idx != -1) { arr.splice(idx); this.className = arr.join(' '); } } }

HTMLTextAreaElement.prototype.addClass      = HTMLInputElement.prototype.addClass;
HTMLTextAreaElement.prototype.removeClass   = HTMLInputElement.prototype.removeClass;

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