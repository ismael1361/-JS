(function(){

  var can_ = DOM('<canvas></canvas>');
  DOM("#thisCan").prepend(can_);

  can_.css({"border":"solid 2px #90a4ae"});
  var can = can_.getDom(),
      ctx = can.getContext('2d'),
      width = can.width = 550,
      height = can.height = 400,
      pp = new Palette();

  var rgb = function(r, g, b){return [r, g, b];}
  var randomColor = function(){return [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];};

  pp.addPaint(randomColor()).move(100, 100).ray(200);
  pp.addPaint(randomColor()).move(200, 100).ray(200);
  pp.addPaint(randomColor()).move(220, 220).ray(200);
  pp.addPaint(randomColor()).move(110, 180).ray(200);

  function update(){
    /*var imageData = ctx.getImageData(0, 0, width, height), d = imageData.data, y = -1;
    for (var i = 0; i < d.length; i += 4){
      var x = (i/4) % width;
      y = x == 0 ? y+1 : y;
      var c = pp.getPick(x, y);
      d[i] = c[0]; d[i+1] = c[1]; d[i+2] = c[2]; d[i+3] = 255;
    }*/
    var imageData = pp.render(width, height);
    ctx.putImageData(imageData, 0, 0);
    //window.requestAnimationFrame(render);
  }

  update();

  var isMove = false, objSelect = null;

  can_.on('mousemove', function(a){
    if(isMove == true && objSelect.move){
      objSelect.move(a.offsetX, a.offsetY);
      update();
    }
  });

  can_.on('mousedown', function(a){
    objSelect = pp.selectPaint(a.offsetX, a.offsetY);
    isMove = true;
  });

  can_.on('mouseup', function(a){
    objSelect = null;
    isMove = false;
  });

  can_.on('mouseout', function(a){
    objSelect = null;
    isMove = false;
  });

  can_.on('dblclick', function(a){
    var r = Math.random();
    pp.addPaint(randomColor()).move(a.offsetX, a.offsetY).ray(r < 0.33 ? 125 : r < 0.66 ? 160 : 200);
    update();
  });
}());