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
      timeout: 30000,
      execTimeout: 30000,
      sendTimeout: 30000,
      debug: true
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
    this.connection.exec(command, function(err, response) {
        if (! err) {
          callback(response)
	} else {
	  console.log(err)
	}
    })
  }
}
