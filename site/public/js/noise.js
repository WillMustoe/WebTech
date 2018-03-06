"use strict"

var yMAX = 1000;
var xMAX =1000;
var Gradient = new Array(xMAX);
for (var x = 0; x < Gradient.length; x++) {
  Gradient[x] = new Array(yMAX);
}

for (var x = 0; x < Gradient.length; x++) {
  for (var y = 0; y < Gradient[x].length; y++) {
    Gradient[x][y] = {
      x : Math.random(),
      y : Math.random()
    }
  }
}

function lerp(a0, a1, w){
  return(1.0 - w)*a0 + w*a1;
}

function dotProduct(ix, iy, x ,y){

  var dx = x - ix;
  var dy = y - iy;

  return (dx*Gradient[ix][iy].x + dy*Gradient[ix][iy].y);
}

function perlin(x, y){
  var x0 = Math.floor(x);
  var x1 = x0 + 1;

  var y0 = Math.floor(y);
  var y1 = y0 + 1;

  var dx = x - x0;
  var dy = y - y0;

  var n0 = dotProduct(x0, y0, x, y);
  var n1 = dotProduct(x1, y0, x, y);
  var ix0 = lerp(n0, n1, dx);

  n0 = dotProduct(x0, y1, x, y);
  n1 = dotProduct(x1, y1, x, y);
  var ix1 = lerp(n0, n1 , dx);

  return (lerp(ix0, ix1, dy)+1)/2;

}
