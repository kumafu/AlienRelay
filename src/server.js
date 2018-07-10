
"use strict";

const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const packetlistener = require("./packetlistener.js");
const crossmgrClient = require('./crossmgrClient.js');
const alienClient = require('./alienClient.js');

const hostname = "0.0.0.0";
const port = 8080;

var bInit = false;
var cl;
var pl;
var ac;

module.exports = class RelayServer {

  start() {
    app.use(express.static(path.join(__dirname+'/..', 'public')));

    // for web client
    io.on('connection', function(socket){
      console.log('[Web] a user connected');
      init();

      if (cl.bConnect) {
        io.emit("log-crossmgr","Already Connected");
        io.emit("state",{crossmgr:1});
    }

      socket.on('cmd', (msg) => {
        console.log('[Web] cmd: ' + msg.cmd);
        //parse
        switch(msg.cmd){
            case "crossmgr-connect":
                cl.connect(msg.ipaddr, 53135);
                break;
            case "alien-connect":
                ac.init(function() {
                    // send 'info', when telnet connection is ready
                    ac.cmd('info', function(err, res) {
                        console.log(err);
                        console.log(res);
                        io.emit("log-alien",res);
                        ac.close()
                    });
                }, io, msg.ipaddr);
                break;;
        }
      });
    });

    function init(){
        if (!bInit){
            console.log("[All] Init all constructor");
            cl = new crossmgrClient();
            cl.init(io);
            pl = new packetlistener();
            pl.init(io, cl);
            ac = new alienClient();
            bInit = true;
        }
    }


    server.listen(port, hostname);
    // io.listen(http);
    console.log(`[Web] Server running at http://${hostname}:${port}`);

    return true;
  }
}
