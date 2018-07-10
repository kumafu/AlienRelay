var socket;
$(document).ready(function(){
    init();
    addEvent();
});

function init(){
    socket = io();
}

function addEvent(){
    //alien command
    $("#alien-connect-btn").click(function(){
        let ipaddr = $("#alien-ip-addr").val();
        socket.emit("cmd",{"cmd":"alien-connect","ipaddr":ipaddr});
    });
    $("#alien-send-cmd").click(function(){
        socket.emit("cmd",{"cmd":"alien-send-cmd","val":$("#alien-cmd-text").val()});
    });


    //crossgmr command
    $("#crossmgr-connect-btn").click(function(){
        let ipaddr = $("#crossmgr-ip-addr").val();
        socket.emit("cmd",{"cmd":"crossmgr-connect","ipaddr":ipaddr});
    });

    //receive
    socket.on('log-general', (msg) => {
        $('#log-field-general').append(msg+"\n");
    });
    socket.on('log-alien', (msg) => {
        $('#log-field-alien').append(msg+"\n");
    });
    socket.on('log-crossmgr', (msg) => {
        $('#log-field-crossmgr').append(msg+"\n");
    });

}