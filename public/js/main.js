var socket;
var state = {alien:0,crossmgr:0};
var bAutoScorll = true;

$(document).ready(function(){
    init();
    addEvent();
});

function init(){
    socket = io();
    $("#alien-ip-addr").val(localStorage.getItem('alien-ip-addr'));
    $("#alien-target-ip-addr").val(localStorage.getItem('alien-target-ip-addr'));
    $("#crossmgr-ip-addr").val(localStorage.getItem('crossmgr-ip-addr'));
}

function addEvent(){
    //alien command
    $("#alien-connect-btn").click(function(){
        let ipaddr = $("#alien-ip-addr").val();
        let target = $("#alien-target-ip-addr").val();
        $('#alien-connect-btn').attr("disabled","disabled");
        socket.emit("cmd",{"cmd":"alien-connect","ipaddr":ipaddr,"target":target});
    });
    $("#alien-send-cmd").click(function(){
        socket.emit("cmd",{"cmd":"alien-send-cmd","val":$("#alien-cmd-text").val()});
    });


    //crossmgr command
    $("#crossmgr-connect-btn").click(function(){
        let ipaddr = $("#crossmgr-ip-addr").val();
        $('#crossmgr-connect-btn').attr("disabled","disabled")
        socket.emit("cmd",{"cmd":"crossmgr-connect","ipaddr":ipaddr});
    });
    $("#crossmgr-close-btn").click(function(){
        $('#crossmgr-close-btn').attr("disabled","disabled")
        socket.emit("cmd",{"cmd":"crossmgr-close"});
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
            $('#alien-connect-btn').removeAttr("disabled");
        } else if (state.alien == 1){
            $('#log-field-alien').css("background-color","#dfd");
            $('#alien-connect-btn').attr("disabled","disabled");
        }
        if (state.crossmgr == 0){
            $('#log-field-crossmgr').css("background-color","#fdd");
            $('#crossmgr-connect-btn').removeAttr("disabled");
            $('#crossmgr-close-btn').attr("disabled","disabled");
        } else if (state.crossmgr == 1){
            $('#log-field-crossmgr').css("background-color","#dfd");
            $('#crossmgr-connect-btn').attr("disabled","disabled");
            $('#crossmgr-close-btn').removeAttr("disabled");
        }
    },200);

}