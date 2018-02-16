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
