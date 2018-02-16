document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  setup();
});
var c;
var ctx;
var scl = 50;
var rows;
var cols;
var offset = 0;
var dir = 1;


function setup(){
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  ctx.moveTo(0,0);
  c.width = 1000
  c.height = 700
  console.log(c.width, c.height);
  rows = c.width/scl;
  cols = c.height/scl;
  var timer = setInterval( draw, 1000/30);
  ctx.strokeStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function draw(){
  offset = offset+dir;
  if(offset === scl) dir = -1;
  if(offset === 0) dir =+1;
  ctx.clear();
  for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
      ctx.lineTo(x*scl+offset, y*scl);
      ctx.lineTo((x+1)*scl, (y+1)*scl);
    }
  }
  ctx.stroke();
}


CanvasRenderingContext2D.prototype.clear =
CanvasRenderingContext2D.prototype.clear || function () {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.beginPath();
};
