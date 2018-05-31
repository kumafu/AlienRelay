
const dgram = require('dgram');

module.exports = class packetlistener {
  constructor() {}

  init() {
    //Notify
    let NotifySock = dgram.createSocket("udp4", function (msg, rinfo) {
      var date = new Date().getTime();
      console.log('got Notify from '+ rinfo.address +':'+ rinfo.port+" | "+date+" | "+rinfo.size);
      io.emit('log', msg.toString('ascii', 0, rinfo.size));
    });
    NotifySock.bind(53000, '0.0.0.0');

    //TagList
    let TagListSock = dgram.createSocket("udp4", function (msg, rinfo) {
      var date = new Date().getTime();
      console.log('got TagList from '+ rinfo.address +':'+ rinfo.port+" | "+date+" | "+rinfo.size);
      io.emit('log', msg.toString('ascii', 0, rinfo.size));
    });
    TagListSock.bind(4000, '0.0.0.0');
    return true;
  }
};
