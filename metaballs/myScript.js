(function(){

  var can_ = DOM('<canvas></canvas>');
  DOM(document.body).append(can_);

  can_.css({"border":"solid 1px #000"});
  var can = can_.getDom(),
      ctx = can.getContext('2d'),
      width = can.width = 400,
      height = can.height = 400;

  var setPixel = function(x, y, c){
    ctx.beginPath();
    ctx.rect(x,y,1,1);
    ctx.fillStyle = Array.isArray(c) && c.length <= 3? 'rgb('+c[0]+' '+c[1]+' '+c[2]+')' : typeof c == "string" ? c : '#000';
    ctx.fill();
  }

  var blending = new blend();
  blending.add([244,67,54]).move(100, 100).ray(200);
  blending.add([33,150,243]).move(200, 100).ray(200);
  blending.add([0,150,136]).move(220, 220).ray(200);
  blending.add([255,193,7]).move(110, 180).ray(200);

  function render(){
    var imageData = ctx.getImageData(0, 0, width, height),
        data = imageData.data;

    /*for(var x=0; x<width; x++){
      for(var y=0; y<height; y++){
        setPixel(x, y, getFragColor(x, y, blending));
      }
    }*/

    var y = -1;
    for (var i = 0; i < data.length; i += 4) {
      var x = (i/4) % width;
      y = x == 0 ? y+1 : y;
      var color = getFragColor(x, y, blending);
      data[i]     = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    //window.requestAnimationFrame(render);
  }

  render();

  var myBoll = blending.add().move(0, 0).ray(100);

  can_.on('mousemove', function(a){
    myBoll.move(a.offsetX, a.offsetY);
    render();
  });

}());