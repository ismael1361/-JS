window.$js = (function(){
  var init = {};
  init.libraryAdd = function(name, calback, type){
    if(type === 'static'){
      init[name] = calback;
    }else{
      window[name] = calback;
    }
  }

  init.libraryAdd('extend', function(a, b){
    for(var c in b){
      if(typeof a[c] == 'object' || a[c] instanceof Array){
        a[c] = this.extend(a[c], b[c]);
      }else{
        a[c] = b[c];
      }
    } 
    return a;
  }, 'static');

  init.libraryAdd('each', function(a, b){
    if(typeof a.splice == 'function'){
      for(var c = 0; c < a.length; c += 1){
        b(c, a[c]);
      }
    }else{
      for(var d in a){
        b(d, a[d]);
      }
    }
  }, 'static');

  init.libraryAdd('grep',  function(a, b){
    var c = []; 
    for(var d = 0; d < a.length; d += 1){
      var e = a[d]; 
      if(b(e)){c.push(e);}
    } 
    return c;
  }, 'static');

  init.libraryAdd('parser', (function(){return new window.DOMParser()}()), 'static');

  return init;
}());