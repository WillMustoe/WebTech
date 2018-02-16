function openSideBar() {
  document.getElementById("main").style.marginLeft = "10em";
  document.getElementById("sidenav").style.width = "10em";
  document.getElementById("sidenav").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function closeSideBar() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("sidenav").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
