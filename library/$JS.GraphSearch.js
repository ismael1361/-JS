(function(){
var fn = {}, GS_;

fn.Node = function(a){
  this.value = a;
  return this;
}

GS_ = $js('GSearch', function(a){
  if(Array.isArray(a) && a.length > 0){
    for(var i=0; i<a.length; i++){
      if(Array.isArray(a[i]) && a[i].length > 0){
        for(var y=0; y<a[i].length; y++){
          a[i][y] = new fn.Node(a[i][y]);
        }
      }else{
        return undefined;
      }
    }
    this.map = a;
    return this;
  }
  return undefined;
});
}());