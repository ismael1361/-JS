(function(){
var isNumber = function(a){return typeof a == 'number';};

var Vector = window.Vector = function(x, y, z){
  this.x = typeof x == 'number'? x : 0;
  this.y = typeof y == 'number'? y : 0;
  this.z = typeof z == 'number'? z : 0;
}

Vector.prototype.Transform = function(a){
  var x = this.x, y = this.y, z = this.z;
  if(Array.isArray(a) && a.length > 8){
    return new Vector(
      (x*a[0]) + (y*a[1]) + (z*a[2]), 
      (x*a[3]) + (y*a[4]) + (z*a[5]), 
      (x*a[6]) + (y*a[7]) + (z*a[8])
    );
  }
  return new Vector(x, y, z);
}

Vector.prototype.rotation = function(a, b, c){
  var r, cos, sin, a = typeof a == 'number'? a : 0, b = typeof b == 'number'? b : 0, c = typeof c == 'number'? c : 0;
  cos = Math.cos(a/180*Math.PI); sin = Math.sin(a/180*Math.PI);
  r = this.Transform([1, 0, 0, 0, cos, -sin, 0, sin, cos]);
  cos = Math.cos(b/180*Math.PI); sin = Math.sin(b/180*Math.PI);
  r = r.Transform([cos, 0, sin, 0, 1, 0, -sin, 0, cos]);
  cos = Math.cos(c/180*Math.PI); sin = Math.sin(c/180*Math.PI);
  r = r.Transform([cos, -sin, 0, sin, cos, 0, 0, 0, 1]);
  return r;
}

var Device = window.Render3d = function(a){
  var a = typeof a == "string"? document.querySelector(a) : a instanceof Element ? a : null;

  if(a == null){return undefined;}

  this.workingCanvas = a;
  this.workingWidth = a.width;
  this.workingHeight = a.height;
  this.workingContext = this.workingCanvas.getContext("2d");
  this.depthbuffer = new Array(this.workingWidth * this.workingHeight);

  this.faces = [];
  this.modifiedFaces = [];

  this.clear();
}

Device.prototype.clear = function(){
    this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
    this.workingContext.fillStyle="#ffffff";
    this.workingContext.fillRect(0, 0, this.workingWidth, this.workingHeight);

    this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
    for (var i = 0; i < this.depthbuffer.length; i++) {
        this.depthbuffer[i] = 10000000;
    }
};

Device.prototype.appendFace = function(a, b, c, d){
  if(Array.isArray(a) && a.length >= 3){
    a = new Vector(a[0], a[1], a[2]);
  }else if((a instanceof Vector) == false && (isNumber(a.x) && isNumber(a.y) && isNumber(a.z)) == true){
    a = new Vector(a.x, a.y, a.z);
  }else{
    a = new Vector(0, 0, 0);
  }
  
  if(Array.isArray(b) && b.length >= 3){
    b = new Vector(b[0], b[1], b[2]);
  }else if((b instanceof Vector) == false && (isNumber(b.x) && isNumber(b.y) && isNumber(b.z)) == true){
    b = new Vector(b.x, b.y, b.z);
  }else{
    b = new Vector(0, 0, 0);
  }

  if(Array.isArray(c) && c.length >= 3){
    c = new Vector(c[0], c[1], c[2]);
  }else if((c instanceof Vector) == false && (isNumber(c.x) && isNumber(c.y) && isNumber(c.z)) == true){
    c = new Vector(c.x, c.y, c.z);
  }else{
    c = new Vector(0, 0, 0);
  }

  if(Array.isArray(d)){
    d = {r: isNumber(d[0]) ? d[0] : 0, g: isNumber(d[1]) ? d[1] : 0, b: isNumber(d[2]) ? d[2] : 0, a: isNumber(d[3]) ? d[3] : 1}
  }else if((isNumber(d.r) || isNumber(d.g) || isNumber(d.b) || isNumber(d.a)) == false){
    d = {r: 0, g: 0, b: 0, a: 1};
  }

  this.faces.push([a, b, c, d]);
  this.modifiedFaces.push([a, b, c, d]);
}

Device.prototype.rotation = function(a, b, c){
  var a = typeof a == 'number'? a : 0, b = typeof b == 'number'? b : 0, c = typeof c == 'number'? c : 0;
  
  for(var i=0; i<this.faces.length; i++){
    var d = this.faces[i];
    for(var j=0; j<(d.length-1); j++){
      if(d[j].rotation){
        this.modifiedFaces[i][j] = d[j].rotation(a, b, c);
      }
    }
  }
}

Device.prototype.centerPoint = function(a){
  var x = a.x, y = a.y, z = a.z,
      b = x + this.workingWidth / 2.0,
      c = -y + this.workingHeight / 2.0;
  return new Vector(b, c, z);
}

Device.prototype.render = function(){
  if(!this.backbuffer){return;}
  this.clear();

  for(var i=0; i<this.faces.length; i++){
    var a = this.modifiedFaces[i];
    this.drawTriangle(this.centerPoint(a[0]), this.centerPoint(a[1]), this.centerPoint(a[2]), a[3]);
  }

  this.workingContext.putImageData(this.backbuffer,0,0);
}

Device.prototype.putPixel = function(x, y, z, c){
    var blendColor = function(a, b, c){c = Math.min(Math.max(c, 0), 1); return [Math.round(c * a[0] + (1 - c) * b[0]), Math.round(c * a[1] + (1 - c) * b[1]), Math.round(c * a[2] + (1 - c) * b[2])]};

    this.backbufferdata = this.backbuffer.data;
    var a = ((x >> 0) + ((y >> 0) * this.backbuffer.width)), b = a * 4;

    if(this.depthbuffer[a] < z){return;}

    this.depthbuffer[a] = z;

    var c = [(isNumber(c.r) ? (c.r * 255) : 0), (isNumber(c.g) ? (c.g * 255) : 0), (isNumber(c.b) ? (c.b * 255) : 0), (isNumber(c.a) ? c.a : 1)],
        nc = [255, 255, 255];

    //var nc = [this.backbufferdata[b], this.backbufferdata[b + 1], this.backbufferdata[b + 2]];
    //c = blendColor(c, nc, c[3]);

    this.backbufferdata[b] = c[0];
    this.backbufferdata[b + 1] = c[1];
    this.backbufferdata[b + 2] = c[2];
    this.backbufferdata[b + 3] = 255;
};

Device.prototype.drawPoint = function(a, b){
  if (a.x >= 0 && a.y >= 0 && a.x < this.workingWidth && a.y < this.workingHeight){
      this.putPixel(a.x, a.y, a.z, b);
  }
};

Device.prototype.clamp = function(value, min, max){
  if (typeof min === "undefined") { min = 0; }
  if (typeof max === "undefined") { max = 1; }
  return Math.max(min, Math.min(value, max));
};

Device.prototype.interpolate = function(min, max, gradient){
  return min + (max - min) * this.clamp(gradient);
};

Device.prototype.processScanLine = function(y, a, b, c, d, e){
    var f = a.y != b.y ? (y - a.y) / (b.y - a.y) : 1,
        g = c.y != d.y ? (y - c.y) / (d.y - c.y) : 1,
        h = this.interpolate(a.x, b.x, f),
        i = this.interpolate(c.x, d.x, g),
        j = this.interpolate(a.z, b.z, f),
        k = this.interpolate(c.z, d.z, g);

    for(var x = h; x < i; x++){
        var m = (x - h) / (i - h),
            z = this.interpolate(j, k, m);
        this.drawPoint(new Vector(x, y, z), e);
    }
};

Device.prototype.drawTriangle = function(a, b, c, d){
  if(a.y > b.y){var temp = b; b = a; a = temp;}
  if(b.y > c.y){var temp = b; b = c; c = temp;}
  if(a.y > b.y){var temp = b; b = a; a = temp;}

  var p1 = 0; var p2 = 0;

  if(b.y - a.y >= 0){p1 = (b.x - a.x) / (b.y - a.y);}
  if(c.y - a.y >= 0){p2 = (c.x - a.x) / (c.y - a.y);}

  var minY = Math.min(a.y, b.y, c.y), maxY = Math.max(a.y, b.y, c.y);

  if(p1 > p2){
    for(var y = minY; y <= maxY; y++){
      if(y < b.y){this.processScanLine(y, a, c, a, b, d);}
      else{this.processScanLine(y, a, c, b, c, d);}
    }
  }else{
    for(var y = minY; y <= maxY; y++){
      if(y < b.y){this.processScanLine(y, a, b, a, c, d);}
      else{this.processScanLine(y, b, c, a, c, d);}
    }
  }
};
}());