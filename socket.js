module.exports = {
	a: function () {
		var ws = require("nodejs-websocket");

		var PORT = 8888;

		var clientCount = 0;

		var userlist = [];

		var server = ws.createServer(function (conn) {
			console.log("New connection");
			console.log("HJY TEST : userlist = "+userlist);
			clientCount++;
			// conn.nickname = 'user' + clientCount;
			// var mes = {};
			// mes.type = "enter";
			// mes.data = conn.nickname + ' comes in';
			// broadcast(JSON.stringify(mes));
			conn.on("text", function (str) {
				// console.log("Received "+str);
				var stri = JSON.parse(str);
				var mes = {};
				if(stri.type === "enterMessage"){
					mes.type = "enter";
					userlist.push(stri.username);
					// mes.data = stri.username;
					mes.data = userlist;
					conn.nickname = stri.username;
					broadcast(JSON.stringify(mes));
				}else if(stri.type === "chatContent"){
					mes.type = "message";
					mes.name = stri.username;
					mes.message = stri.text;
					if(stri.img)
						mes.img = stri.img;
					broadcast(JSON.stringify(mes));
				}
			});
			conn.on("close", function (code, reason) {
				console.log("connection closed");
				var mes = {};
				mes.type = "leave";
				mes.data = conn.nickname;
				var i = 0;
				for(i=0;i<userlist.length;i++){
					if(userlist[i] === conn.nickname){
						userlist.splice(i,1);
					}
				}
				broadcast(JSON.stringify(mes));
			});
			conn.on("error", function (err) {
				console.log("handle err");
				console.log(err);
			})
		}).listen(PORT);

		console.log("websocket server listening on port : "+PORT);

		function broadcast (str) {
			server.connections.forEach(function(connection){
				connection.sendText(str);
			})
		}
	}
}