
const net = require('net');
const client = require('./crossmgrClient.js');

module.exports = class packetlistener {
  constructor() {}

  init(_io) {
	net.createServer(function(NotifySock) {
		console.log('CONNECTED: ' + NotifySock.remoteAddress +':'+ NotifySock.remotePort);
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
		console.log('CONNECTED: ' + TagStreamSock.remoteAddress +':'+ TagStreamSock.remotePort);
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
