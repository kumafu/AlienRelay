var telnet = require('telnet')
const port = 8023

telnet.createServer(function (client) {
    var loginRequired = true;
    var passwordRequired = true;
    client.do.transmit_binary()
    client.do.window_size()
    client.on('window size', function(e) {
        if (e.command == 'sb') {
	    console.log('telnet window resized')
	}
    })

    client.on('data', function(b) {
        console.log("received: ", b)
	if (loginRequired) {
	    if (b == "alien\n") {
	        console.log("username")
		loginRequired = false
		passwordRequired = true
		client.write("PASSWORD>")
	    }
	} else if (passwordRequired) {
	    if (b == "password\n") {
	        console.log("password")
	        passwordRequired = false
		client.write("ALIEN>")
		console.log("login complete")
	    }
	}
    })
   
    client.write("***********************************************\n*\n* Alien Technology : RFID Reader \n*\n***********************************************\n\n")
    client.write("Username>")

}).listen(port)
