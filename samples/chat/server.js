var http = require("http")
var path = require("path")
var ws = require("../../lib")
var fs = require("fs")

http.createServer(function (req, res) {
	fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res)
}).listen(8008)
console.log(`start server: http://127.0.0.1:8008`);

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast(str+" entered")
		} else
			broadcast("["+connection.nickname+"] "+str)
	})
	connection.on("close", function () {
		broadcast(connection.nickname+" left")
	})
})
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}
