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

var rooms = {};
var users = {};
var views = {};

// var rtId = 1;

/* var players = {};
var activeRooms = {}; */

/* function roomView(client, roomNumber, language, view, owner, header, main, footer) {


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
} */

/* function roomView(client, roomNumber, language, view, owner, header, main, footer) {


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
} */

io.on('connection', function(socket) {
	// All views data emit
	function viewClient(client, view, room) {
		let elements = [];

		if ((view = 'viewlobby')) {
			elements = [ room.number, 'blablabla' ];
		}

		let dataTo = {
			room: room,
			elements: elements
		};

		client.emit(view, dataTo);
	}

	// Create room

	socket.on('create room', function(data) {
		let roomNumber = Math.floor(Math.random() * 899999) + 100000;
		rooms[roomNumber] = {
			number: roomNumber,
			language: data.language,
			view: 'viewlobby',
			playerlist: [ data.nickname ],
			players: 1
		};

		users[data.nickname] = {
			nickname: data.nickname,
			room: roomNumber,
			socketid: socket.id
		};

		console.log('#' + rooms[roomNumber].number + ' - New room created :');
		console.log('-- Owner: ' + rooms[roomNumber].playerlist[0]);
		console.log('-- Language : ' + rooms[roomNumber].language);

		//rtId++;

		socket.join(roomNumber);

		viewClient(socket, rooms[roomNumber].view, rooms[roomNumber]);

		/* 		let elements = [roomNumber, 'blablabla'];

		let dataTo = {
			room: rooms[roomNumber],
			elements: elements
		}

		socket.join(roomNumber);
		socket.emit('viewlobby', dataTo); */

		//roomView(rooms[roomNumber], 'viewlobby');
		//roomView(socket, roomNumber, data.language, 'viewlobby', data.nickname, '', roomNumber, '');
	});

	// Join room

	socket.on('join room', function(data) {
		let roomNumber = parseInt(data.number, 10);
		if (rooms[roomNumber]) {
			rooms[roomNumber].playerlist.push(data.nickname);
			rooms[roomNumber].players += 1;

			users[data.nickname] = {
				nickname: data.nickname,
				room: roomNumber,
				socketid: socket.id
			};
			console.log(
				'#' +
					rooms[roomNumber].number +
					' - New player : ' +
					data.nickname +
					' (' +
					rooms[roomNumber].players +
					')'
			);

			socket.join(roomNumber);

			viewClient(socket, rooms[roomNumber].view, rooms[roomNumber]);

			//joueurs.insert({ userid: data.userid, nickname: data.nickname, activeroom: roomNumber });

			// let language = rooms[roomNumber].language;
			// let owner = rooms[roomNumber].playerlist[0];

			/* let elements = [roomNumber, 'blablabla'];

			let dataTo = {
				room: rooms[roomNumber],
				elements: elements
			}

			socket.join(roomNumber);
			socket.emit('viewlobby', dataTo); */

			// socket.join(roomNumber);
			// roomView(socket, roomNumber, language, 'viewlobby', owner, '', roomNumber, '');
		} else {
			socket.emit('no room');
		}
	});

	// User disconnect
	socket.on('disconnect', () => {
		for (x in users) {
			let currentRoom = rooms[users[x].room];
			// If user was in a room...
			if (users[x].socketid === socket.id) {
				currentRoom.players -= 1;
				// If no more players in room, delete the room, else decrease number of players
				if (currentRoom.players === 0) {
					console.log('#' + currentRoom.number + ' - Room deleted, no more players');
					delete currentRoom;
				} else {
					console.log(
						'#' +
							currentRoom.number +
							' - Player left : ' +
							users[x].nickname +
							' (' +
							currentRoom.players +
							')'
					);
					// Delete from playerlist, send new owner if list[0] changed
					let pList = currentRoom.playerlist;
					for (i = 0; i < pList.length; i++) {
						if (pList[i] === users[x].nickname) {
							pList.splice(i, 1);
							if (i === 0) {
								viewClient(io.to(currentRoom.number), currentRoom.view, currentRoom);
								//roomView(io.to(currentRoom.number), currentRoom.number, currentRoom.language, currentRoom.view, pList[0], '', currentRoom.number, '');
								console.log('-- New owner : ' + pList[0]);
							}
						}
					}
				}
				//Delete the user
				delete users[x];
			}
		}
	});
});

/* setInterval(function() {
	io.to('room1').emit('state', players);
}, 1000 / 60); */
