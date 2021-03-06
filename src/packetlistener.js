
const net = require('net');
const client = require('./crossmgrClient.js');

module.exports = class packetlistener {
  constructor() {
    this.io;
    this.cl;
    this.logs = {};
    this.timeThresh = 10;
  }


  init(_io, _cl) {
    this.io = _io;
    this.cl = _cl;
    console.log("[TagStream] init for TagStream server");
    this.io.emit("log-general","init for TagStream server");

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

    var that = this;
    net.createServer(function(TagStreamSock) {
        console.log('[TagStream] CONNECTED: ' + TagStreamSock.remoteAddress +':'+ TagStreamSock.remotePort);
        TagStreamSock.on('data', function(data) {
            console.log('[TagStream] DATA: ' + data );
            parsePacket(data.toString());
            //_io.emit('log', "Receive: TagStream from" + TagStreamSock.remoteAddress + ":" + TagStreamSock.remotePort);

              function parsePacket(_str){
                let strs = _str.split('\n');
                for (var line in strs){
                    //Format must be 'Text'
                    if (strs[line].indexOf("Tag:") != -1){
                        try{
                            let eachSection = strs[line].split(',');
                            let tagID = Number(eachSection[0].replace("\0","").replace("Tag:","").replace(" ",""));
                            let date = eachSection[1].replace("Disc:","").trim();
                            let count = Number(eachSection[3].replace("Count:",""));
                            let ant = Number(eachSection[4].replace("Ant:",""));
                            console.log("[TagStream] Parsed Data: ",TagStreamSock.remoteAddress,tagID,date,count,ant);
                            //that.io.emit('log-general', `[TagStream] Received [${TagStreamSock.remoteAddress}]: ${tagID},${date},c:${count},a:${ant}`);
                            let datetime = new Date(date);
                            if (!that.logs[tagID] || (that.logs[tagID] && datetime - that.logs[tagID].date > that.timeThresh * 1000)){
                                if (that.cl.bConnect && !isNaN(tagID)) {
                                    that.cl.sendData(tagID,date,count,ant);
                                    that.logs[tagID] = {"date":datetime};
                                }
                            }else{
                                console.log("[TagStream] Received but not sent:",tagID,date,count,ant);
                                //that.io.emit('log-general', `[TagStream] Received but not sent: ${tagID},${date},c:${count},a:${ant}`);

                            }
                        }catch(e){
                            console.log("[TagStream] Parse error: " + e);
                            that.io.emit('log-general', '[TagStream] Parse error: ' + e);
                        }
                    }
                }
              }
        });
        TagStreamSock.on('close', function(had_error) {
            console.log('[TagStream] CLOSED. ' + TagStreamSock.remoteAddress + ' / Had Error:' + had_error);
            that.io.emit("log-general",'[TagStream] CLOSED. ' + TagStreamSock.remoteAddress + ' / Had Error:' + had_error);
        });
        TagStreamSock.on('error', function(err) {
            console.log('[TagStream] ERROR: ' + err.stack);
            that.io.emit("log-general",'[TagStream] ERROR: ' + err.stack);
        });
    }).listen(4000);

    return true;
  }
  setTimethresh(_val){
    this.timeThresh = _val;
    console.log('[TagStream] Set Timethresh: ' + _val + "sec.");
    this.io.emit("log-general",'[TagStream] Set Timethresh: ' + _val + "sec.");
  }

};
