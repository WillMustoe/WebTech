var c;
var ctx;
var scl = 100;
var res = 12;
var rows;
var cols;
var offset = 0;
var dir = 1;


function setup(){
  c = document.getElementById("canvas");

  ctx = c.getContext('2d', { alpha: false });
  ctx.moveTo(0,0);
  canvas_resize();
  window.requestAnimationFrame(draw);
  window.addEventListener("resize", canvas_resize);

  var rangeSlider = document.getElementById("resSlider");
  rangeSlider.oninput = resSliderUpdate;

  var sclSlider = document.getElementById("scaleSlider");
  sclSlider.oninput = sclSliderUpdate;

}

function draw(){

  offset = (offset + 1) % 360;
  for (var y = 0; y <= rows; y++) {
    for (var x = 0; x <= cols; x++) {

      var val = perlin(((x)*res)/scl, ((y)*res)/scl)*360;
      val = (Math.floor(val) + offset) % 360;
      ctx.fillStyle = 'hsl(' + val + ', ' + 100 + '%, 50%)';
      ctx.fillRect( x*res, y*res, res, res );
    }
  }
  window.requestAnimationFrame(draw);
}

function canvas_resize(){
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  rows = Math.floor(c.height/res);
  cols = Math.floor(c.width/res);
  console.log("Resixe to:" + cols + ":" + rows);
}

CanvasRenderingContext2D.prototype.clear =
CanvasRenderingContext2D.prototype.clear || function () {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.beginPath();
};


document.addEventListener("DOMContentLoaded", function(event) {
  setup();
});

function resSliderUpdate(){
    res = Math.floor(this.value);
    rows = Math.floor(c.height/res);
    cols = Math.floor(c.width/res);
}

function sclSliderUpdate(){
    scl = Math.floor(this.value);
}
