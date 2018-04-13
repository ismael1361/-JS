var can_ = DOM('<canvas></canvas>');
DOM(document.body).prepend(can_);
can_.css({
  "border":"solid 1px #000"
});

var can = can_.getDom(), width = can.width = 500, height = can.height = 500;

var draw = new Render3d(can);

draw.appendFace([10, 10, -100], [200, 200, 0], [10, 200, 100], [0, 1, 1]);
draw.appendFace([200, 10, 100], [200, 200, 0], [10, 200, -100], [1, 0, 1]);

draw.rotation(0, 0, 180);
draw.render();

var anime = function(i){
  i = i > 360 ? 0 : i;
  draw.rotation(0, 0, i);
  draw.render();

  setTimeout(function(){
    anime(i + 1)
  }, 1);
}

//anime(0);

var a = new Vector(2, 6, 1);
console.log(a);

console.log(a.rotation(90, 0, 50));