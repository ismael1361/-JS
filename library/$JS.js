window.$js = (function(){
  var fs = {}, fr = {}, je;
  
  fs.extend = function(a, b){
    for(var c in b){
      if(typeof a[c] == 'object' || a[c] instanceof Array){
        a[c] = this.extend(a[c], b[c]);
      }else{
        a[c] = b[c];
      }
    } 
    return a;
  }
  
  fs.each = function(a, b){
    if(typeof a.splice == 'function'){
      for(var c = 0; c < a.length; c += 1){
        b(c, a[c]);
      }
    }else{
      for(var d in a){
        b(d, a[d]);
      }
    }
  };
  
	fs.grep = function(a, b){
    var c = []; 
    for(var d = 0; d < a.length; d += 1){
      var e = a[d]; 
      if(b(e)){c.push(e);}
    } 
    return c;
  };
  
  fs.matches = function(a, b){
    if(a.nodeType != 1){
      return false;
    }else if(!b){
      return true;
    } 
    var c = b.split(/[,\s]+/g); 
    for(var d = 0; d < c.length; d += 1){
      var e = c[d]; 
      if(e.substring(0, 1) == '#'){
        throw 'not supported:' + e;
      }else if(e.substring(0, 1) == '.'){
        if(fs.hasClass(a, e.substring(1))){
          return true;
        }
      }else{
        if(a.tagName.toUpperCase() == e.toUpperCase()){
          return true;
        }
      }
    } 
    return false;
  };
  
  fs.parser = new window.DOMParser();
  
  fs.root = function(a, b){
    if(typeof a == 'string' && typeof b == 'function'){
      var c = {};
      c[a] = b;
      fs = fs.extend(fs, c);
    }
    return fs;
  }
  
  fr.static = function(a, b, c){
    if((typeof a == 'object' || typeof a == 'function') && typeof b == 'string' && typeof c == 'function'){
      var d = {};
      d[b] = c;
      a = fs.extend(a, d);
      return a;
    }
    return;
  }

  
  je = function(){
    var a = arguments, b = {root: fs};
    if(typeof a[0] == 'function'){
      document.addEventListener('DOMContentLoaded', a[0]);
    }else if(typeof a[0] == 'string' && typeof a[1] == 'function'){
      var d = {};
      d[a[0]] = a[1];
      b.static = function(e, f){
        if(typeof e == 'string' && typeof f == 'function'){
          d[a[0]] = fr.static(d[a[0]], e, f);
          return d[a[0]];
        }
        return this;
      }
      d[a[0]] = fs.extend(d[a[0]], b);
      fs.extend(je, d);
      return d[a[0]];
    }
  };
	
	return fs.extend(je, {root: fs.root, extend : fs.extend, each : fs.each, grep : fs.grep});
}());