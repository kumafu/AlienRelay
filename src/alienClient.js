"use strict";
const Telnet = require('telnet-client')
var ALIEN_HOST_ADDRESS;
var io;


module.exports = class AlienClient {
  init(onReady, _io, _ipaddr) {
    io = _io;
    ALIEN_HOST_ADDRESS = _ipaddr;
    this.onReady = onReady
    this.connection = new Telnet();
    this.telnet_params = {
      host: ALIEN_HOST_ADDRESS,
      port: 23,
      username: "alien",
      password: "password",
      shellPrompt: "Alien>",
      loginPrompt: "Username>",
      passwordPrompt: "Password>",
      timeout: 1000 * 60 * 60 * 24,
      execTimeout: 60000,
      sendTimeout: 1000,
      debug: false,
      maxBufferLength: 100000
    }

    var that = this;
    this.connection.on('ready', function(prompt) {
      console.log(prompt)
      that.onReady()
      console.log('[Alien] Connected')
      io.emit('log-alien','Connected');
      io.emit("state",{alien:1});
    })
    this.connection.on('error', function() {
      console.log('[Alien] ERROR')
      io.emit('log-alien','Error: ');
      that.connection.end();
    })
    this.connection.on('timeout', function() {
      console.log('socket timeout!')
      that.connection.end();
    })
    this.connection.on('close', function() {
      console.log('[Alien] Connection closed');
      io.emit('log-alien','Connection closed');
      io.emit("state",{alien:0});
    })

    console.log('[Alien] START CONNECTING...')
    io.emit('log-alien','START CONNECTING...');
    this.connection.connect(this.telnet_params);
  }

  cmd(command, callback) {
    this.connection.exec(command, this.telnet_params, function(err, response) {
        callback(err, response)
    })
  }

  cmds(commands, callback, lastCallback) {
    var that = this;
    var funcs = [];
    var wait = true;
    f(0);
    function f(i){
        that.connection.exec(commands[i], that.telnet_params, function(err, res) {
          console.log(commands[i]);
          callback(err, res);
          i++;
          if (i < commands.length) f(i);
          else lastCallback();
        });
    }

  }

  close() {
    this.connection.end();
  }
  
}
