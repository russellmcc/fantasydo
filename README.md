# Fantasy Do

Fantasy do is a generalization of mozilla's [`task.js`](http://taskjs.org/) from [Promises/A+](http://promises-aplus.github.io/promises-spec/) to any monad, as defined by the [Fantasy Land Spec](https://raw.github.com/fantasyland/fantasy-land/).  While usage is syntactically similar to Haskell's Do Notation, it's implemented completely at runtime with [ES6 generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators).  

![Fantasy Land Branding](https://raw.github.com/fantasyland/fantasy-land/master/logo.png)

## Usage

Fantasy Do requires ES6 generators.  In node, you can enable these with the `--harmony` option.

If you happen to have a browser with ES6 support, use the included `fantasydo.min.js` with your [module loader of choice](https://github.com/forbeslindesay/umd), or just with a `script` tag.

The library is available for `node.js` on `npm` under `fantasydo`

### Normal mode

If your monad only calls the argument to the `chain` function once ('non-branching'), you can use Fantasy Do's normal, high-performance mode.

First, you'll need a monad.  See the [Fantasy Land Implementation List](https://github.com/fantasyland/fantasy-land/blob/master/implementations.md) to find some monads that may work for you.

Here's a very simple `Maybe` monad:
	
	var Maybe = {}
	Maybe.chain = function(f) {
	    if(this.val !== null)
	        return f(this.val);
	    return this;
	};
	Maybe.of = function(t) {
	    return {"val" : t, "chain" : Maybe.chain};
	};
	Maybe.none = function() {
	    return {"val" : null, "chain" : Maybe.chain};
	};

Now, we can write a function that depends on multiple maybe values, and will only complete if all of them are not `none`:

	Do(function*(){
	    var a = yield testm.of(7);
	    var b = yield testm.of(a + 9);
	    return b;
	 }).val // => 16

    Do(function*(){
        var a = yield testm.of(7);
        var q = yield testm.none();
        var b = yield testm.of(a + 9);
        return b;
    }, testm).val  // => null

### Multi-mode

Fantasy Do also supports monads that may call their `chain` parameter multiple times, like the non-determinism context (aka the list monad).  Without the ability to copy generator state, this works by re-runninng the generator from the beginning for each branch.  This may behave strangely if your bind argument has significant side-effects.

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

then, 

    Do.Multi(function*(){
        let c = yield [1, 2];
        let d = yield [c + 1, c + 2];
        return d;
    } // => [2, 3, 3, 4]

## License

<p xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license"
     href="http://creativecommons.org/publicdomain/zero/1.0/">
    <img src="http://i.creativecommons.org/p/zero/1.0/80x15.png" style="border-style: none;" alt="CC0" />
  </a>
  <br />
  To the extent possible under law,
  <a rel="dct:publisher"
     href="russellmcc.com">
    <span property="dct:title">Russell McClellan</span></a>
  has waived all copyright and related or neighboring rights to
  <span property="dct:title">Fantasy Do</span>.
This work is published from:
<span property="vcard:Country" datatype="dct:ISO3166"
      content="US" about="russellmcc.com">
  United States</span>.
</p>