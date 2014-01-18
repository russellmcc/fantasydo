// Dedicated to the public domain with the CC0/1.0 license

"use strict"

var Do = function(gen, m) {
    var doing = gen();
    var doRec = function(v){
        var a = doing.next(v);
        if(a.done) {
            return m.of(a.value);
        } else {
            return a.value.chain(doRec);
        }
    };
    return doRec(null);
};

Do.Multi = function(gen, m) {
    var doRec = function(v, stateSoFar){
        // okay, let's make this sucker!
        var doing = gen();
        stateSoFar.forEach(function(it){doing.next(it)});
        var a = doing.next(v);
        if(a.done) {
            return m.of(a.value);
        } else {
            return a.value.chain(function(vv){return doRec(vv, stateSoFar.concat(v));})
        }
    };
    return doRec(null, []);
};

module.exports = Do;


