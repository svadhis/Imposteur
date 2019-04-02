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
app.use('/db', express.static('db'));

TAFFY = require('taffy');

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
var activeRooms = {};

function roomView(client, roomNumber, language, view, owner, header, main, footer) {
	let roomViewData = {
		view: view,
		header: header,
		main: main,
		footer: footer,
		language: language,
		number: roomNumber,
		players: '',
		owner: owner
	};

	client.emit(view, roomViewData);
}

io.on('connection', function(socket) {
	// Create room

	socket.on('create room', function(data) {
		let roomNumber = Math.floor(Math.random() * 899999) + 100000;
		rooms.insert({
			id: rtId,
			number: roomNumber,
			owner: data.userid,
			language: data.language,
			state: 'inlobby',
			players: 1
		});
		console.log('----------------------------------');
		console.log('New room(' + rtId + ') created #' + roomNumber);
		console.log('Owner: ' + rooms({ id: rtId }).first().owner);
		console.log('Language : ' + rooms({ id: rtId }).first().language);

		rtId++;

		socket.join(roomNumber);
		roomView(socket, roomNumber, data.language, 'inviteplayer', data.userid, '', roomNumber, '');	
	});

	// Join room

	socket.on('join room', function(data) {
		let roomNumber = parseInt(data.number, 10);
		if (rooms({ number: roomNumber }).count() > 0) {
			let playerNumber = rooms({ number: roomNumber }).first().players;
			rooms({ number: roomNumber }).update({ players: playerNumber + 1 });
			joueurs.insert({ userid: data.userid, nickname: data.nickname, activeroom: roomNumber });

			let language = rooms({ number: roomNumber }).first().language;
			let owner = rooms({ number: roomNumber }).first().owner;

			socket.join(roomNumber);
			roomView(socket, roomNumber, language, 'inviteplayer', owner, '', roomNumber, '');
		} else {
			socket.emit('no room');
		}
	});
});

/* setInterval(function() {
	io.to('room1').emit('state', players);
}, 1000 / 60); */
