/*
 *       |_)                     |             
 *  _` | | |  _ \ __ \   __| _ \ |  _` | |   |
 * (   | | |  __/ |   | |    __/ | (   | |   |
 *\__,_|_|_|\___|_|  _|_|  \___|_|\__,_|\__, |
 *                                      ____/ 
 */

"use strict";

const relay = require("./server.js");
const alien = require("./alien.js");

function main() {
  const relay_server = new relay(new alien());
  relay_server.start();
}

main();

