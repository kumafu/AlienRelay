"use strict";
const Telnet = require('telnet-client')

const ALIEN_HOST_ADDRESS = "192.168.251.210"

module.exports = class AlienClient {
  init(onReady) {
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
    })
    this.connection.on('timeout', function() {
        console.log('socket timeout!')
        that.connection.end();
    })
    this.connection.on('close', function() {
        console.log('connection closed');
    })

    this.connection.connect(this.telnet_params);
  }

  cmd(command, callback) {
    this.connection.exec(command, this.telnet_params, function(err, response) {
        callback(err, response)
    })
  }
}
