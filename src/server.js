
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

module.exports = class RelayServer {

  start() {
    app.use(express.static(path.join(__dirname+'/..', 'public')));

    let cl = new crossmgrClient();
    cl.init(io);
    let pl = new packetlistener();
    pl.init(io, cl);
    let ac = new alienClient();
    
    // for web client
    io.on('connection', function(socket){
      console.log('a user connected');

      socket.on('cmd', (msg) => {
        console.log('cmd: ' + msg.cmd);
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
                        io.emit("log",res);
                    });
                }, io, msg.ipaddr);
                break;;

        }
      });
    });


    server.listen(port, hostname);
    // io.listen(http);
    console.log(`Server running at http://${hostname}:${port}`);

    return true;
  }
}
