//DOM Library V0.0.1
var fn = {}, DOM;

$js.root('hasClass', function(a, b){
  var c = (a.getAttribute('class') || '').split(/\s+/g); 
  for(var d in c){
    if(c[d] == b){
      return true;
    }
  } 
  return false;
});

$js.root('addClass', function(a, b){
  if(this.hasClass(a, b) == false){
    var c = (a.getAttribute('class') || '').split(/\s+/g); 
    c.push(b); 
    a.setAttribute('class', c.join(' '));
  } 
  return false;
});

$js.root('removeClass', function(a, b){
  if(this.hasClass(a, b) == true){
    var c = (a.getAttribute('class') || '').split(/\s+/g), 
    d = new Array(); 
    for(var e in c){
      if(c[e] != b){
        d.push(c[e]);
      }
    } 
    a.setAttribute('class', d.join(' '));
  } 
  return false;
});

$js.root('matches', function(a, b){
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
      if($js.root().hasClass(a, e.substring(1))){
        return true;
      }
    }else{
      if(a.tagName.toUpperCase() == e.toUpperCase()){
        return true;
      }
    }
  } 
  return false;
});

$js.root('html', function(a){
  var b = this.parser.parseFromString('<div xmlns="http://www.w3.org/1999/xhtml">'+a+'</div>','text/xml').firstChild, 
      c = []; 
  while(b.firstChild){
    c.push(b.firstChild); 
    b.removeChild(b.firstChild);
  }
  c.__proto__ = fn; 
  return c;
});

$js.root('pxToNum', function(a){
  if(!a || typeof a != 'string' || a.length <= 2 || a.charAt(a.length - 2) != 'p' || a.charAt(a.length - 1) != 'x'){
    return 0;
  } 
  return +a.substring(0, a.length - 2);
});

fn.attr = function(a){
  if(arguments.length == 1){
    if(typeof a == 'string'){
      return this.getAttribute(a);
    } 
    for(var b in a){
      this.setAttribute(b, a[b]);
    }
  }else if(arguments.length == 2){
    this.setAttribute(a, arguments[1]);
  } 
  return this;
}

fn.prop = function(a){
  if(arguments.length == 1){
    if(typeof a == 'string'){
      return this[a];
    } 
    for(var b in a){
      this[b] = a[b];
    }
  }else if(arguments.length == 2){
    this[a] = arguments[1];
  } 
  return this;
}

fn.css = function(a){
  if(arguments.length == 1){
    if(typeof a == 'string'){
      return this.style[a];
    } 
    for(var b in a){
      this.style[b] = a[b];
    }
  }else if(arguments.length == 2){
    this.style[a] = arguments[1];
  } 
  return this;
}

fn.val = function(){
  if(arguments.length == 0){
    return this.value || '';
  }else if(arguments.length == 1){
    this.value = arguments[0];
  } 
  return this;
}

fn.on = function(a, b){
  var c = a.split(/\s+/g); 
  for(var d = 0; d < c.length; d += 1){
    this.addEventListener(c[d], b);
  } 
  return this;
}

fn.off = function(a, b){
  var c = a.split(/\s+/g); 
  for(var d = 0; d < c.length; d += 1){
    this.removeEventListener(c[d], b);
  } 
  return this;
}

fn.offset = function(){
  var a = {left:0, top:0}, 
      b = null; 
  for(var c = this; c.parentNode != null; c = c.parentNode){
    if(c.offsetParent != null){
      b = c; break;
    }
  } 
  if(b != null){
    for(var c = b; c.offsetParent != null; c = c.offsetParent){
      a.left += c.offsetLeft; 
      a.top += c.offsetTop;
    }
  } 
  for(var c = this; c.parentNode != null && c != document.body; c = c.parentNode){
    a.left -= c.scrollLeft; 
    a.top -= c.scrollTop;
  } 
  return a;
}

fn.append = function(a){
  if(typeof a == 'string'){
    a = $js.root().html(a);
  } 
  for(var b = 0; b < a.length; b += 1){
    this.appendChild(a[b]);
  } 
  return this;
}

fn.prepend = function(a){
  if(typeof a == 'string'){
    a = $js.root().html(a);
  } 
  for(var b = 0; b < a.length; b += 1){
    if(this.firstChild){
      this.insertBefore(a[b], this.firstChild);
    }else{
      this.appendChild(a[b]);
    }
  } 
  return this;
}

fn.insertBefore = function(a){
  var b = a[0]; 
  b.parentNode.insertBefore(this, b); 
  return this;
}

fn.insertAfter = function(a){
  var b = a[0]; 
  if(b.nextSibling){
    b.parentNode.insertBefore(this, b.nextSibling);
  }else{
    b.parentNode.appendChild(this);
  } 
  return this;
}

fn.remove = function(){
  if(this.parentNode){
    this.parentNode.removeChild(this);
  } 
  return this;
}

fn.detach = function(){
  if(this.parentNode){
    this.parentNode.removeChild(this);
  } 
  return this;
}

fn.parent = function(){
  return $js.DOM(this.parentNode);
}

fn.closest = function(a){
  for(var b = this; b != null; b = b.parentNode){
    if($js.root().matches(b, a)){
      return $js.DOM(b);
    }
  } 
  return $js.DOM();
}

fn.children = function(a){
  var b = [], 
      c = this.childNodes; 
  for(var d = 0; d < c.length; d += 1){
    if($js.root().matches(c.item(d), a)){
      b.push(c.item(d));
    }
  } 
  b.__proto__ = fn; 
  return b;
}

fn.index = function(a){
  return Array.prototype.indexOf.call($js.DOM(this).parent().children(a), this);
}

fn.find = function(a){
  var b = [], 
      c = this.querySelectorAll(a); 
  for(var d = 0; d < c.length; d += 1){
    b.push(c.item(d));
  } 
  b.__proto__ = fn; 
  return b;
}

fn.clone = function(){return $js.DOM(this.cloneNode(true));}

fn.focus = function(){this.focus(); return this;}

fn.select = function(){this.select(); return this;}

fn.submit = function(){this.submit(); return this;}

fn.scrollLeft = function(){
  if(arguments.length == 0){
    return this.scrollLeft;
  } 
  this.scrollLeft = arguments[0]; 
  return this;
}

fn.scrollTop = function(){
  if(arguments.length == 0){
    return this.scrollTop;
  } 
  this.scrollTop = arguments[0]; 
  return this;
}

fn.html = function(){
  if(arguments.length == 0){
    return this.innerHTML;
  } 
  this.innerHTML = arguments[0]; 
  return this;
}

fn.text = function(){
  if(typeof this.textContent != 'undefined'){
    if(arguments.length == 0){
      return this.textContent;
    } 
    this.textContent = arguments[0]; 
    return this;
  }else{
    if(arguments.length == 0){
      return this.innerText;
    } 
    this.innerText = arguments[0]; 
    return this;
  }
}

fn.outerWidth = function(a){
  var b = this.offsetWidth; 
  if(a){
    var c = window.getComputedStyle(this, null); 
    return b + $js.root().pxToNum(c.marginLeft) + $js.root().pxToNum(c.marginRight);
  } 
  return b;
}

fn.innerWidth = function(){
  var a = window.getComputedStyle(this, null); 
  return this.offsetWidth - $js.root().pxToNum(a.borderLeftWidth) - $js.root().pxToNum(a.borderRightWidth);
}

fn.width = function(){
  if(this == window){
    return this.innerWidth;
  } 
  var a = window.getComputedStyle(this, null); 
  return this.offsetWidth - $js.root().pxToNum(a.borderLeftWidth) - $js.root().pxToNum(a.borderRightWidth) - $js.root().pxToNum(a.paddingLeft) - $js.root().pxToNum(a.paddingRight);
}

fn.outerHeight = function(a){
  var b = this.offsetHeight; 
  if(a){
    var c = window.getComputedStyle(this, null); 
    return b + $js.root().pxToNum(c.marginTop) + $js.root().pxToNum(c.marginBottom);
  } 
  return b;
}

fn.innerHeight = function(){
  var a = window.getComputedStyle(this, null); 
  return this.offsetHeight - $js.root().pxToNum(a.borderTopWidth) - $js.root().pxToNum(a.borderBottomWidth);
}

fn.height = function(){
  if(this == window){
    return this.innerHeight;
  } 
  var a = window.getComputedStyle(this, null); 
  return this.offsetHeight - $js.root().pxToNum(a.borderTopWidth) - $js.root().pxToNum(a.borderBottomWidth) - $js.root().pxToNum(a.paddingTop) - $js.root().pxToNum(a.paddingBottom);
}

fn.getSize = function(){
  var a = (this.width || this.innerWidth || this.clientWidth), 
      b = (this.height || this.innerHeight || this.clientHeight); 
  return {width: a, height: b}
}

fn.addClass = function(a){
  $js.root().addClass(this, a); 
  return this;
}

fn.removeClass = function(a){
  $js.root().removeClass(this, a); 
  return this;
}

fn.hasClass = function(a){
  return $js.root().hasClass(this, a);
}

fn.getPath = function(){
    var a = String(this.tagName).toLocaleLowerCase();
    if(this.id){
        a += '#'+this.id;
    }else if(this.classList.length > 0){
        for(var b = 0; b<this.classList.length; b++){
            a += '.'+this.classList[b];
        }
    }
    return a;
}
fn.getAllPath = function(){
    var a = [], b = this.parentNode;
    a.push($js.DOM(this).getPath());
    while(b){
        if(!b.tagName || b.tagName == 'BODY' || b.tagName == 'HTML'){break;}
        var c = String(b.tagName).toLocaleLowerCase();
        if(b.id){
            c += '#'+b.id;
            b=b.parentNode;
        }else if(b.classList && b.classList.length > 0){
            for(var d = 0; d<b.classList.length; d++){
                c += '.'+b.classList[d];
            }
        }
        a.unshift(c);
        b=b.parentNode;
    }
    return a.join(" > ");
}

$js.each(fn, function(a, b){
  fn[a] = function(){
    var c = null; 
    for(var d = 0; d < this.length; d += 1){
      var e = this[d], 
          g = b.apply(e, arguments); 
      if(e !== g){
        if(g != null && g.__proto__ == fn){
          if(c == null){c = [];} 
          c = c.concat(g);
        }else{
          return g;
        }
      }
    } 
    if(c != null){
      c.__proto__ = fn; 
      return c;
    }
    return this;
  };
});

fn = $js.extend(fn, {
  each : function(a){
    for(var b = 0; b < this.length; b += 1){
      a.call(this[b], b);
    } 
    return this;
  },

  getDom : function(){
    return this.length > 0? this[0] : null;
  },

  first : function(){
    return $js.DOM(this.length > 0? this[0] : null);
  },

  last : function(){
    return $js.DOM(this.length > 0? this[this.length - 1] : null);
  }
});

DOM = $js('DOM', function(a){
  if(typeof a == 'string'){
    if(a.charAt(0) == '<'){
      return DOM.root.html(a);
    }else{
      var b = document.querySelectorAll(a), 
          c = []; 
      for(var d = 0; d < b.length; d += 1){
        c.push(b.item(d));
      } 
      c.__proto__ = fn; 
      return c;
    }
  }else if(typeof a == 'object' && a != null){
    if(a.__proto__ == fn){
      return a;
    }else{
      var c = []; 
      c.push(a); 
      c.__proto__ = fn; 
      return c;
    }
  }else{
    var c = []; 
    c.__proto__ = fn; 
    return c;
  }
});