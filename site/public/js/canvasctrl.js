"use strict"

var baseURL = window.location.origin + '/';

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
    var webgl = c.getContext('webgl', {preserveDrawingBuffer: true}) || c.getContext('experimental-webgl', {preserveDrawingBuffer: true});
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

  var saveButton = document.getElementById("savebutton");
  saveButton.onclick = saveButtonClick;

  var saveBG = document.getElementById("saveBackground");
  saveBG.onclick = toggleSaveDialog;

  var saveDialogButton = document.getElementById("saveDialogButton");
  saveDialogButton.onclick = saveDialogButtonClick;

  saveDialogButton
  
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
  var hex = this.value;
  colour = colourToFloats(hex);
}

function colourPickerUpdateBG(){
  var hex = this.value;
  colourbg = colourToFloats(hex);
}

function colourToFloats(hex){
  var r = Number(parseInt(hex[1] + hex[2], 16))/255;
  var g = Number(parseInt(hex[3] + hex[4], 16))/255;
  var b = Number(parseInt(hex[5] + hex[6], 16))/255;

  return {r, g, b};
}

function saveDialogButtonClick(){
  var imgName = document.getElementById("imageName");
    if(imgName.value == ""){
      imgName.focus();
        alert("Image name is required");
        return;
    }

    var imageData = {
      img : canvas.toDataURL('image/png'),
      imgName : imgName
    }
    post(baseURL + "img", imageData);
    var imgName = document.getElementById("imageName").value ="";
    toggleSaveDialog();
}

function saveButtonClick(){
  toggleSaveDialog();
}

function toggleSaveDialog() {
  var popup = document.getElementById("saveBackground");
  popup.classList.toggle("show");
  var saveBox = document.getElementById("saveForm");
  saveBox.classList.toggle("show");
}

function post(url, details) {
  var params = Object.keys(details).map(
      function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
      }
  ).join('&');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.onreadystatechange = function () {
      if (this.readyState == this.DONE && this.status == 200) {
          location.href = this.responseURL;
      }
      else if(this.readyState == this.DONE && (this.status == 400 || this.status == 401)){
          alert(this.responseText);
      }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}

document.addEventListener("DOMContentLoaded", function (event) {
  setup();
});