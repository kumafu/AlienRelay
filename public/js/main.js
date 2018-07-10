var socket;
var state = {alien:null,crossmgr:null};
var bAutoScorll = true;

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

    //autoscroll
    $("#autoscroll").change(function(){
        bAutoScorll = $(this).attr("checked");
    });


    //receive
    socket.on('log-general', (msg) => {
        let elem = $('#log-field-general')
        elem.append(msg+"\n");
        if (bAutoScorll) elem.scrollTop(elem[0].scrollHeight - elem.height());
    });
    socket.on('log-alien', (msg) => {
        let elem = $('#log-field-alien');
        elem.append(msg+"\n");
        if (bAutoScorll) elem.scrollTop(elem[0].scrollHeight - elem.height());
    });
    socket.on('log-crossmgr', (msg) => {
        let elem = $('#log-field-crossmgr');
        elem.append(msg+"\n")
        if (bAutoScorll) elem.scrollTop(elem[0].scrollHeight - elem.height());
    });

    //save localstorage
    $(".settings").change(function(){
        console.log("save");
        localStorage.setItem($(this).attr('id'),$(this).val());
    });

    //state receive
    socket.on('state', (msg) => {
        for (var key in msg){
            state[key] = msg[key];
        }
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