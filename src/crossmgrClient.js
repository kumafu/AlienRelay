
const net = require('net');
var client;

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

  constructor() {}

  init() {
  	var HOST = '192.168.1.7';
	var PORT = 53135;
	client = new net.Socket();
	console.log("START CONNECTING");
	client.connect(PORT, HOST, function() {
	    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	    client.write("N0000AlienRelay\r");
	});
	client.on('close', function() {
	    console.log('Connection closed');
	});
	client.on('data', function(data) {
	    console.log('DATA: ' + data);
	    if (data.toString().substr(0,2) == "GT"){

	    	client.write("GT0"+formatDate(new Date(),"hhmmssSSS")+" date="+formatDate(new Date(),"YYYYMMDD")+"\r");
	    }
	    if (data.toString().substr(0,5) == "S0000"){
	    	console.log("Ready to send data")
	    }
	});
  }

  send(_msg){
	client.write(_msg + "\r");
  }

  format(n , lap, t){
	message = '<?xml version="1.0" encoding="UTF-8"?>\
	<Alien-RFID-Reader-Auto-Notification>\
 <ReaderName>{readerName}</ReaderName>\
 <ReaderType>{readerType}</ReaderType>\
 <IPAddress>{notifyHost}</IPAddress>\
 <CommandPort>{cmdPort}</CommandPort>\
 <MACAddress>{macAddress}</MACAddress>\
 <Time>{time}</Time>\
 <Reason>TEST MESSAGE</Reason>\
 <Alien-RFID-Tag-List>\
   <Alien-RFID-Tag>\
    <TagID>{tag}</TagID>\
	<DiscoveryTime>{discoveryTime}</DiscoveryTime>\
	<LastSeenTime>{lastSeenTime}</LastSeenTime>\
	<Antenna>0</Antenna>\
	<ReadCount>{readCount}</ReadCount>\
	<Protocol>1</Protocol>\
   </Alien-RFID-Tag>\
 </Alien-RFID-Tag-List>\
</Alien-RFID-Reader-Auto-Notification>\r\n\0';
	return message;
  }
}
// count = 0
// def formatMessage( n, lap, t ):
// 	global count
// 	message = '''<?xml version="1.0" encoding="UTF-8"?>
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
// 	<DiscoveryTime>{discoveryTime}</DiscoveryTime>
// 	<LastSeenTime>{lastSeenTime}</LastSeenTime>
// 	<Antenna>0</Antenna>
// 	<ReadCount>{readCount}</ReadCount>
// 	<Protocol>1</Protocol>
//    </Alien-RFID-Tag>
//  </Alien-RFID-Tag-List>
// </Alien-RFID-Reader-Auto-Notification>\r\n\0'''

// 	tStr = t.strftime( '%Y/%m/%d %H:%M:%S.%f' )
// 	options = alienOptions
// 	options.update(
// 		{
// 			'tag':				tag[n],
// 			'time':				tStr,
// 			'discoveryTime':	tStr,
// 			'lastSeenTime':		tStr,
// 			'readCount':		count,
// 		}
// 	)
// 	count += 1
	
// 	s = message.format( **options )
// 	doc = parseString( s[:-3] )
// 	return message.format( **options )