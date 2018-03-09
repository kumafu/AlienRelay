var socket;
$(document).ready(function(){
    init();
    addEvent();
});

function init(){
	socket = io();
}

function addEvent(){
	$("#login").click(function(){
		socket.emit("login","null");
	});
}