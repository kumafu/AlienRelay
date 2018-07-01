
"use strict";

const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const packetlistener = require("./packetlistener.js");
const crossmgrClient = require('./crossmgrClient.js');

const hostname = "0.0.0.0";
const port = 8080;

module.exports = class RelayServer {

  constructor(datasource) {
    this.datasource = datasource;
  }

  start() {
    app.use(express.static(path.join(__dirname+'/..', 'public')));


    let cl = new crossmgrClient();
    cl.init();
    let pl = new packetlistener();
    pl.init(io, cl);

    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('login', (msg) => {
        console.log('login: ' + msg);
        //TODO: login sequence
        io.emit("log","login...")
      });
      socket.on('send-cmd', (msg) => {
        console.log('cmd: ' + msg);
        //send cmd to crossmgr
        cl.send(msg);
      });
    });





    server.listen(port, hostname);
    console.log(`Server running at http://${hostname}:${port}`);
    return true;
  }

};
