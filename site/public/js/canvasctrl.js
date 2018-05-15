var c;
var ctx;
var glHost;
var depth = 0.03;
var scale = 12;
var colour = {r: 0.83, g: 0.83, b: 0.83};
var colourbg = {r: 0.83, g: 0.83, b: 0.83};

if (window.requestAnimationFrame == null) {
  window.requestAnimationFrame =
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(f) {
          setTimeout(f, 16);
      };
}


function setup() {
  c = document.getElementById("canvas");
  try {
    var webgl = c.getContext('webgl') ||
      c.getContext('experimental-webgl');
    if (webgl == null) throw new Error('Could not get WebGL context.');
    glHost = new GLHost(webgl);
  } catch (e) {
    alert('Unable to initialize WebGL: ' + e);
    throw e;
  }
  canvas_resize();
  window.addEventListener("resize", canvas_resize);
  window.requestAnimationFrame(draw);

  var rangeSlider = document.getElementById("scaleSlider");
  rangeSlider.oninput = scaleSliderUpdate;

  var depthSlider = document.getElementById("depthSlider");
  depthSlider.oninput = depthSliderUpdate;

  var colourPicker = document.getElementById("colourpicker");
  colourPicker.oninput = colourPickerUpdate;

  var colourPickerbg = document.getElementById("colourpickerbg");
  colourPickerbg.oninput = colourPickerUpdateBG;
  
}

function draw() {
  glHost.depth += depth;
  glHost.scale = scale;
  glHost.r = colour.r;
  glHost.g = colour.g;
  glHost.b = colour.b;
  glHost.r_bg = colourbg.r;
  glHost.g_bg = colourbg.g;
  glHost.b_bg = colourbg.b;
  glHost.render();
  window.requestAnimationFrame(draw);
}

function canvas_resize() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  glHost.gl.viewport(0, 0, c.width, c.height);
}

CanvasRenderingContext2D.prototype.clear =
  CanvasRenderingContext2D.prototype.clear || function () {
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.beginPath();
  };


function scaleSliderUpdate() {
  scale = this.value;
}

function depthSliderUpdate() {
  depth = this.value/1000;
}

function colourPickerUpdate(){
  hex = this.value;
  colour = colourToFloats(hex);
}

function colourPickerUpdateBG(){
  hex = this.value;
  colourbg = colourToFloats(hex);
}

function colourToFloats(hex){
  r = Number(parseInt(hex[1] + hex[2], 16))/255;
  g = Number(parseInt(hex[3] + hex[4], 16))/255;
  b = Number(parseInt(hex[5] + hex[6], 16))/255;

  return {r, g, b};
}

document.addEventListener("DOMContentLoaded", function (event) {
  setup();
});