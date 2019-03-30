// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.use('/css', express.static('css'));

TAFFY = require( 'taffy' );

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
	console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {});

/* test
setInterval(function() {
	io.sockets.emit('message', 'hi!');
}, 1000);
*/

//Creation des bases Taffy

var rooms = TAFFY();
	
var joueurs = TAFFY();

var rtId = 1;
var jtId = 1;

var players = {};
let activeRooms = [];
io.on('connection', function(socket) {
	
	// Créer room

	socket.on('create room', function(data) {
		//data[0] language
		//data[1] userid
		let lang = "";
		if (data[0] === "1") {
			lang = "english";
		}
		else if (data[0] === "2") {
			lang = "french";
		}
		else {
			lang = "spanish";
		}
		let roomNumber = Math.floor(Math.random() * 89999) + 10000;
		rooms.insert({"id":rtId,"number":roomNumber,"owner":data[1],"language":lang});
		joueurs.insert({"id":jtId,"number":roomNumber,"owner":data[1],"language":lang});

		console.log(rooms({id:0}).first().owner);

		rtId++;
		socket.join(roomNumber);
		socket.emit('invite owner', roomNumber);

	});


	// Rejoindre room

	socket.on('join room', function() {
		let joinRoom = document.querySelector("#room").value;
		for (x in activeRooms) {
			if (x.number === joinRoom) {
				x.players.push(players[socket.id]);
				socket.join(joinRoom);
			}
			else {
				document.querySelector("#message").innerHTML = "non bah non";
			}
		}
	});


	socket.on('new player', function() {
		players[socket.id] = {
			x: 300,
			y: 300
		};
	});
	/* socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if (data.left) {
			player.x -= 5;
		}
		if (data.up) {
			player.y -= 5;
		}
		if (data.right) {
			player.x += 5;
		}
		if (data.down) {
			// player.y += 5;
			player.y = 25;
		}
	}); */
});

setInterval(function() {
	io.to('room1').emit('state', players);
}, 1000 / 60);
