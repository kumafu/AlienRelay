
"use strict";

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const hostname = "0.0.0.0";
const port = 8080;

module.exports = class RelayServer {

  constructor(datasource) {
    this.datasource = datasource;
  }

  start() {
    app.use(express.static(path.join(__dirname+'/..', 'public')));

    app.listen(port, hostname);
    console.log(`Server running at http://${hostname}:${port}`);
    return true;
  }

};
