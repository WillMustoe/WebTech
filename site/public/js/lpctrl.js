"use strict"

addEventListener('load', start);

function start(){
  var createButton = document.getElementById("create");
  createButton.addEventListener('click', gotoCreate);

  var viewButton = document.getElementById("view");
  viewButton.addEventListener('click', gotoView); 
}

function gotoView(){
    location.href='/html/view.html'
}

function gotoCreate(){
    location.href='/html/play.html'
}


