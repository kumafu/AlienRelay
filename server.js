
"use strict";

const express = require("express");

const hostname = "0.0.0.0";
const port = 8080;

module.exports = class RelayServer {

  constructor(datasource) {
    this.server = express();
    this.datasource = datasource;
  }

  start() {
    this.server.get("/", (req, res) => {
      res.send("no implemention");
    });

    this.server.listen(port, hostname);
    console.log(`Server running at http://${hostname}:${port}`);
  }

};
