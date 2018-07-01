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

	socket.on('log', (msg) => {
    	$('#log-field').append(msg+"\n");
    });
	$("#send-cmd").click(function(){
		socket.emit("send-cmd",$("#cmd-text").val());
	});
}