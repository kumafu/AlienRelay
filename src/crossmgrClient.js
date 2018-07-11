
const net = require('net');
var client;
var io;

var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

module.exports = class crossmgrClient {

  constructor() {
    this.bConnect = false;
  }

  init(_io) {
    io = _io;
  }

  connect(_host, _port){
    if (this.bConnect){
      console.log('[CrossMgr] Already Connected');
      io.emit("log-crossmgr","Already Connected");
      io.emit("state",{crossmgr:1});
      this.bConnect = true;
      return;
    }
    var HOST = _host;
    var PORT = _port;
    var that = this;
    client = new net.Socket();
    console.log("[CrossMgr] START CONNECTING...");
    io.emit("log-crossmgr","START CONNECTING...");

    client.connect(PORT, HOST, function() {
        console.log('[CrossMgr] CONNECTED TO: ' + HOST + ':' + PORT);
        client.write("N0000AlienRelay\r");
        io.emit("state",{crossmgr:1});
        that.bConnect = true;
    });
    client.on('error', function(err) {
        console.log('[CrossMgr] Connect ERROR: ' + err.stack);
        io.emit("log-crossmgr","ERROR:"+err.stack);
    });
    client.on('close', function() {
        console.log('[CrossMgr] Connection closed');
        io.emit("log-crossmgr",'Connection closed');
        io.emit("state",{crossmgr:0});
        that.bConnect = false;
    });
    client.on('data', function(data) {
        console.log('DATA: ' + data);
        if (data.toString().substr(0,2) == "GT"){
            let text = "GT0"+formatDate(new Date(),"hhmmssSSS")+" date="+formatDate(new Date(),"YYYYMMDD")+"\r";
            client.write(text);
            io.emit("log-crossmgr",text);
        }
        if (data.toString().substr(0,5) == "S0000"){
            console.log("[CrossMgr] Ready to send data");
            io.emit("log-crossmgr","Ready to send data");
        }
    });

  }

  sendData(tag, time, readCount, antenna) {
    let msg = this.format(tag, time, readCount, antenna)
    console.log(`[CrossMgr] SendData: ${msg}`);
    io.emit("log-crossmgr",`SendData: ${msg}`);
    this.send(msg)
  }

  send(_msg){
    client.write(_msg + "\r");
  }

  close(){
    if (this.bConnect){
      console.log("close")
      client.end();
    }
  }

  format(tag, time, readCount, antenna){
    let datetime = new Date(time);
    let timeOnly = formatDate(datetime, "hh:mm:ss.SSS");
    let dateOnly = formatDate(datetime, "YYYYMMDD");
    let message = `DA${tag} ${timeOnly} 10  00003      C7 date=${dateOnly}`;

    console.log(message);
    
    return message;
  }
}
// count = 0
// def formatMessage( n, lap, t ):
//  global count
//  message = '''<?xml version="1.0" encoding="UTF-8"?>
// <Alien-RFID-Reader-Auto-Notification>
//  <ReaderName>{readerName}</ReaderName>
//  <ReaderType>{readerType}</ReaderType>
//  <IPAddress>{notifyHost}</IPAddress>
//  <CommandPort>{cmdPort}</CommandPort>
//  <MACAddress>{macAddress}</MACAddress>
//  <Time>{time}</Time>
//  <Reason>TEST MESSAGE</Reason>
//  <Alien-RFID-Tag-List>
//    <Alien-RFID-Tag>
//     <TagID>{tag}</TagID>
//  <DiscoveryTime>{discoveryTime}</DiscoveryTime>
//  <LastSeenTime>{lastSeenTime}</LastSeenTime>
//  <Antenna>0</Antenna>
//  <ReadCount>{readCount}</ReadCount>
//  <Protocol>1</Protocol>
//    </Alien-RFID-Tag>
//  </Alien-RFID-Tag-List>
// </Alien-RFID-Reader-Auto-Notification>\r\n\0'''

//  tStr = t.strftime( '%Y/%m/%d %H:%M:%S.%f' )
//  options = alienOptions
//  options.update(
//      {
//          'tag':              tag[n],
//          'time':             tStr,
//          'discoveryTime':    tStr,
//          'lastSeenTime':     tStr,
//          'readCount':        count,
//      }
//  )
//  count += 1
    
//  s = message.format( **options )
//  doc = parseString( s[:-3] )
//  return message.format( **options )
