var socket;
var state = {alien:0,crossmgr:0};

$(document).ready(function(){
    init();
    addEvent();
});

function init(){
    socket = io();
    $("#alien-ip-addr").val(localStorage.getItem('alien-ip-addr'));
    $("#alien-tagstream-ip-addr").val(localStorage.getItem('alien-tagstream-ip-addr'));
    $("#crossmgr-ip-addr").val(localStorage.getItem('crossmgr-ip-addr'));
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


    //crossmgr command
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

    //save localstorage
    $(".settings").change(function(){
        console.log("save");
        localStorage.setItem($(this).attr('id'),$(this).val());
    });

    //state checker
    setInterval(function(){
        if (state.alien == 0){
            $('#log-field-alien').css("background-color","#fdd");
        } else if (state.alien == 1){
            $('#log-field-alien').css("background-color","#dfd");
        }
        if (state.crossmgr == 0){
            $('#log-field-crossmgr').css("background-color","#fdd");
        } else if (state.crossmgr == 1){
            $('#log-field-crossmgr').css("background-color","#dfd");
        }
    },200);

}