
const net = require('net');
const client = require('./crossmgrClient.js');

module.exports = class packetlistener {
  constructor() {
    console.log("Make PL constructor");
  }


  init(_io, _cl) {
    console.log("init for TagStream server");
    // net.createServer(function(NotifySock) {
    //     console.log('ONNECTED: ' + NotifySock.remoteAddress +':'+ NotifySock.remotePort);
    //     NotifySock.on('data', function(data) {
    //         console.log('DATA: ' + data );
    //         _io.emit('log', "Receive: Notify from" + NotifySock.remoteAddress + ":" + NotifySock.remotePort);
    //     });
    //     NotifySock.on('close', function(had_error) {
    //         console.log('CLOSED. Had Error: ' + had_error);
    //     });
    //     NotifySock.on('error', function(err) {
    //         console.log('ERROR: ' + err.stack);
    //     });
    // }).listen(53136);

    net.createServer(function(TagStreamSock) {
        console.log('CONNECTED: ' + TagStreamSock.remoteAddress +':'+ TagStreamSock.remotePort);
        TagStreamSock.on('data', function(data) {
            parsePacket(data.toString());
            console.log('DATA: ' + data );
            //_io.emit('log', "Receive: TagStream from" + TagStreamSock.remoteAddress + ":" + TagStreamSock.remotePort);
            _io.emit('log', "Receive: "+data);

              function parsePacket(_str){
                let strs = _str.split('\n');
                for (var line in strs){
                    if (strs[line].indexOf("Tag:") === 0){
                        let eachSection = strs[line].split(',');
                        let tagID = Number(eachSection[0].replace("Tag:0000 ",""));
                        let date = eachSection[1].replace("Disc:","");
                        let count = Number(eachSection[3].replace("Count:",""));
                        let ant = Number(eachSection[4].replace("Ant:",""));
                        console.log("Parsed Data:",tagID,date,count,ant);
                    }
                }
              }
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
