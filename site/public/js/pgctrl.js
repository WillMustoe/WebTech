"use strict"

addEventListener('load', start);

function start(){
  var openNav = document.getElementById("openNav");
  openNav.addEventListener('click', openSideBar);

  var closeNav = document.getElementById("closeNav");
  closeNav.addEventListener('click', closeSideBar); 
}



function openSideBar() {
  document.getElementById("main").style.marginLeft = "10em";
  document.getElementById("sidenav").style.left = "0";
  document.getElementById("openNav").style.display = 'none';
}
function closeSideBar() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("sidenav").style.left = "-10em";
  document.getElementById("openNav").style.display = "inline-block";
}
