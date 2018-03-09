$(document).ready(function(){
    init();
    addEvent();
});

function init(){

}

function addEvent(){
	var target = document.getElementById('login');
	target.addEventListener('click', function(){
		alert();
	}, false);
}