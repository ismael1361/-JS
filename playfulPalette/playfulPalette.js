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

function blend(){
  this.paints = [];
}

blend.prototype.add = function(color){
  var a = new bubble(10, 10, color);
  this.paints.push(a);
  return a;
}

function getFragColor(x, y, blend){
  blend = !blend.paints ? [] : blend.paints;
  var dishCnt = blend.length;
  if(dishCnt == 0){return [255, 255, 255];}

  var b2 = 0.25, influence = 0, color = [0, 0, 0];

  for(var i=0; i<dishCnt; i++){
    var bub = blend[i],
        r = bub.r,
        diff = function(a, b){if (a > b){return (a - b);}else{return (b - a);}},
        dx = diff(bub.x, x),
        dy = diff(bub.y, y),
        d2 = (dx * dx + dy * dy) / r / r;
    if(d2 <= b2){
      var d4 = d2 * d2, d5 = 1-(4*d4*d2 / (b2**3)-17*d4 / (b2**2)+22*d2 / b2)/9;
      if(d5 > 0.001){
        color[0] = (color[0]) + (bub.color[0]/255) * d5;
        color[1] = (color[1]) + (bub.color[1]/255) * d5;
        color[2] = (color[2]) + (bub.color[2]/255) * d5;
        influence += d5;
      }
    }
  }
  if(influence < 0.3){
    return [255, 255, 255];
  }else{
    color[0] = Math.round((color[0] / influence)*255);
    color[1] = Math.round((color[1] / influence)*255);
    color[2] = Math.round((color[2] / influence)*255);
    return color;
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