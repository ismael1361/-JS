(function(){
function bubble(x, y, color, r){
  this.x = x;
  this.y = y;
  this.color = Array.isArray(color) ? color : [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];
  this.r = typeof r == "number"? r : 300;
}
bubble.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
};
bubble.prototype.ray = function(r) {
  this.r = r;
  return this;
};
bubble.prototype.containThisPosition = function(x, y){
  return this.x - this.r < x && this.x + this.r > x && this.y - this.y < y && this.y + this.r > y;
}

function blend(){
  this.paints = [];
}

blend.prototype.add = function(color){
  var a = new bubble(10, 10, color);
  this.paints.push(a);
  return a;
}

function getFragColor(x, y, blend){
  blend = !blend.paints || !(blend.paints instanceof Array) ? [] : blend.paints;
  if(blend.length == 0){return [255, 255, 255];}

  var b2 = 0.25, b3 = b2 * b2, b4 = b3 * b2, f = 0, p = 1, c = [0, 0, 0];

  for(var i=0; i<blend.length; i++){
    if(!blend[i].containThisPosition(x, y)){continue;}
    var bub = blend[i], r = bub.r,
        dx = (bub.x-x), dy = (bub.y-y),
        d2 = (dx * dx + dy * dy) / r / r;
    if(d2 <= b2){
      var d4 = d2 * d2, d5 = 1-(4*d4*d2 / b4-17*d4 / b3+22*d2 / b2)/9;
      c[0] = (c[0]) + (bub.color[0]/255) * d5;
      c[1] = (c[1]) + (bub.color[1]/255) * d5;
      c[2] = (c[2]) + (bub.color[2]/255) * d5;
      f += d5;
    }
  }

  var max = 0.4, border = 0.02;

  if(f < max){
    return [255, 255, 255];
  }else{
    p = f < (max+border) ? Math.min(Math.max(((f-max)/(border)), 0), 1) : 1;
    c[0] = Math.round((1 - p) * 255 + p * ((c[0] / f)*255));
    c[1] = Math.round((1 - p) * 255 + p * ((c[1] / f)*255));
    c[2] = Math.round((1 - p) * 255 + p * ((c[2] / f)*255));
    return c;
  }
}

var pp = window.Palette = function(){
  this.paints = new blend();
}

pp.prototype.addPaint = function(c){
  var a = this.paints.add(c);
  return a;
}

pp.prototype.getPick = function(x, y){
  return getFragColor(x, y, this.paints);
}

pp.prototype.render = function(w, h){
  var p = this.paints, x = 0, y = 0, img = document.createElement('canvas').getContext('2d').createImageData(w, h), d = img.data;
  for(var i=0; i < d.length; i+=4){
    var x = (i/4) % w;
    y = x == 0 ? y+1 : y;
    var c = getFragColor(x, y, p);
    d[i] = c[0]; d[i+1] = c[1]; d[i+2] = c[2]; d[i+3] = 255;
  }
  return img;
}

pp.prototype.selectPaint = function(x, y){
  var p = this.paints.paints,
      dist = function(a, b, r){
        var r = typeof r == "number" ? r : 50,
            diff = function(a, b){if (a > b){return (a - b);}else{return (b - a);}},
            dx = diff(a.x, b.x),
            dy = diff(a.y, b.y);
        return (dx * dx + dy * dy) / r / r;
      };
  p.sort(function(a, b){
    var pt = {x: x, y: y};
    return dist(pt, a, a.r)-dist(pt, b, b.r);
  });

  if(dist({x: x, y: y}, p[0], p[0].r) <= 0.25){
    return p[0];
  }
  return false;
}

}());