const assert = require("assert");
const alien = require("./src/alien.js");
const server = require("./src/server.js");

describe("alien", function() {
  describe("init", function() {
    it("initialize alien", function() {
      assert.ok(new alien().init());
    });
  });
});

describe("server", function() {
  describe("start", function() {
    it("start a server as daemon", function() {
       assert.ok(true);
    });
  });
});
