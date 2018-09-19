var ws = require("nodejs-websocket");

var PORT = 8888;

var clientCount = 0;

var server = ws.createServer(function (conn) {
	console.log("New connection");
	clientCount++;
	conn.nickname = 'user' + clientCount;
	var mes = {};
	mes.type = "enter";
	mes.data = conn.nickname + ' comes in';
	broadcast(JSON.stringify(mes));
	conn.on("text", function (str) {
		// console.log("Received "+str);
		var stri = JSON.parse(str);
		var mes = {};
		mes.type = "message";
		mes.name = conn.nickname;
		mes.message = stri.text;
		if(stri.img)
			mes.img = stri.img;
		broadcast(JSON.stringify(mes));
	});
	conn.on("close", function (code, reason) {
		console.log("connection closed");
		var mes = {};
		mes.type = "leave";
		mes.data = conn.nickname + ' left';
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