
const net = require('net');
const client = require('./crossmgrClient.js');

module.exports = class packetlistener {
  constructor() {
    console.log("Make PL constructor");
  }

  init(_io, _cl) {
    console.log("init for Tag/Notify server");
    net.createServer(function(NotifySock) {
        console.log('Init for Notify: CONNECTED: ' + NotifySock.remoteAddress +':'+ NotifySock.remotePort);
        NotifySock.on('data', function(data) {
            console.log('DATA: ' + data );
            _io.emit('log', "Receive: Notify from" + NotifySock.remoteAddress + ":" + NotifySock.remotePort);
        });
        NotifySock.on('close', function(had_error) {
            console.log('CLOSED. Had Error: ' + had_error);
        });
        NotifySock.on('error', function(err) {
            console.log('ERROR: ' + err.stack);
        });
    }).listen(53136);

    net.createServer(function(TagStreamSock) {
        console.log('Init for TagStream: CONNECTED: ' + TagStreamSock.remoteAddress +':'+ TagStreamSock.remotePort);
        TagStreamSock.on('data', function(data) {
            console.log('DATA: ' + data );
            _io.emit('log', "Receive: TagStream from" + TagStreamSock.remoteAddress + ":" + TagStreamSock.remotePort);
        });
        TagStreamSock.on('close', function(had_error) {
            console.log('CLOSED. Had Error: ' + had_error);
        });
        TagStreamSock.on('error', function(err) {
            console.log('ERROR: ' + err.stack);
        });
    }).listen(4000);
    return true;
  }
};
