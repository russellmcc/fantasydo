// Dedicated to the public domain with the CC0/1.0 license

"use strict"

var Do = require('../index');
var assert = require('chai').assert;

var testm = {}
testm.chain = function(f) {
    if(this.val !== null)
        return f(this.val);
    return this;
};
testm.of = function(t) {
    return {"val" : t, "chain" : testm.chain};
};
testm.none = function() {
    return {"val" : null, "chain" : testm.chain};
};

suite('single-call chain', function(){
    test('testm.of should work', function(){
        assert.equal(1, testm.of(1).val);
    });
    test('testm.chain should work', function(){
        assert.equal(testm.of(1).chain(function(n){return testm.of(n + 2)}).val, 3);
    });
    test('do notation should work', function(){
        assert.equal(Do(function*(){
            var a = yield testm.of(7);
            var b = yield testm.of(a + 9);
            return b;
        }, testm).val, 16);
    });
    test('do notation should not continue pass fail', function(){
        var c = 0;
        assert.equal(Do(function*(){
            var a = yield testm.of(7);
            var q = yield testm.none();
            c = 18;
            var b = yield testm.of(a + 9);
            return b;
        }, testm).val, null);
        assert.equal(c, 0);
    });
});

Array.prototype.chain = function(f) {
  let next = [];
  let len = this.length;
  this.forEach(function(it){
      let v = f(it);
      v.forEach(function(it){next.push(it)});
  });
  return next;
};
Array.prototype.of = function(t) {return [t];}

suite('multi-call chain', function(){
    test('should work without Do', function(){
        assert.deepEqual([1, 2].chain(function(x){
            return [x + 1, x + 2];
        }), [2, 3, 3, 4]);
    });
    test('should work with Do.Multi', function(){
        assert.deepEqual(Do.Multi(function*(){
            let c = yield [1, 2];
            let d = yield [c + 1, c + 2];
            return d;
        }, Array.prototype), [2, 3, 3, 4]);
    });
});
