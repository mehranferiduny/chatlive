var mql = window.matchMedia("screen and (max-width: 700px)");

if(mql.matches){
function comment() {
	
	document.getElementById('sideone').style='display:none';
	document.getElementById('conversation').style='display:block';


  }
function onliin() {
	
	document.getElementById('conversation').style='display:none';
	document.getElementById('sideone').style='display:block';


  }
}


