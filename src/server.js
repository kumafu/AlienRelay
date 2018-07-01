
"use strict";

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const Telnet = require('telnet-client')

const hostname = "0.0.0.0";
const ALIEN_HOST_ADDRESS = "192.168.1.150"
//const ALIEN_HOST_ADDRESS = "192.168.251.200"
const port = 8080;

module.exports = class RelayServer {

  constructor(datasource) {
    this.datasource = datasource;
    this.connection = new Telnet();
    this.telnet_params = {
        host: ALIEN_HOST_ADDRESS,
	port: 23,
	username: "alien",
	password: "password",
	// loginPrompt: "***********************************************\n*\n* Alien Technology : RFID Reader \n*\n***********************************************",
	// shellPrompt: "Username>",
	loginPrompt: "Username>",
	passwordPrompt: "Password>",
	timeout: 10000,
	execTimeout: 10000,
	sendTimeout: 10000,
	debug: true
    }

    var that = this;
    this.connection.on('ready', function(prompt) {
        console.log("on ready: " + prompt);
        that.connection.exec("info", function(err, response) {
	    console.log("err: " + err);
	    console.log("response: " + response);
	    callback(response);
	})
    })
    this.connection.on('timeout', function() {
        console.log('socket timeout!')
        that.connection.end();
    })
    this.connection.on('close', function() {
        console.log('connection closed');
    })
    console.log("connecting")
    this.connection.connect(this.telnet_params);
    console.log("connected")
  }

  start() {
    app.use(express.static(path.join(__dirname+'/..', 'public')));
    app.listen(port, hostname);
    io.listen(http);
    console.log(`Server running at http://${hostname}:${port}`);

    return true;
  }

  get_telnet_response(conn, cmd, callback) {
    console.log("conn is " + typeof conn)
    console.log("conn.on is " + typeof conn.on)
    conn.on('ready', function(prompt) {
        console.log("on ready: " + prompt);
        conn.exec(cmd, function(err, response) {
	    console.log("err: " + err);
	    console.log("response: " + response);
	    callback(response);
	})
    })
  }

}
