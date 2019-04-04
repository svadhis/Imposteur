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

var rooms = {};
var users = {};

io.on('connection', function(socket) {
	// Create room
	socket.on('create room', function(data) {
		let roomNumber = Math.floor(Math.random() * 899999) + 100000;
		rooms[roomNumber] = {
			number: roomNumber,
			language: data.language,
			view: 'lobby',
			playerlist: [ data.nickname ]
			//players: 1
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
		socket.emit('viewclient', rooms[roomNumber]);
	});

	// Join room
	socket.on('join room', function(data) {
		let roomNumber = parseInt(data.number, 10);
		if (rooms[roomNumber]) {
			rooms[roomNumber].playerlist.push(data.nickname);
			//rooms[roomNumber].players += 1;

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
					rooms[roomNumber].playerlist.length +
					')'
			);

			socket.join(roomNumber);
			io.to(roomNumber).emit('playerjoined', data.nickname);
			io.to(roomNumber).emit('viewclient', rooms[roomNumber]);
		} else {
			socket.emit('noroom');
		}
	});

	// User disconnect
	socket.on('disconnect', () => {
		let newOwner = '';
		for (x in users) {
			let currentRoom = rooms[users[x].room];
			let pList = currentRoom.playerlist;
			let currentOwner = pList[0];
			// If user was in a room...
			if (users[x].socketid === socket.id) {
				//currentRoom.players -= 1;

				// Delete from playerlist, send new owner if list[0] changed

				for (i = 0; i < pList.length; i++) {
					if (pList[i] === users[x].nickname) {
						pList.splice(i, 1);
						newOwner = pList[0];
						console.log(
							'#' +
								currentRoom.number +
								' - Player left : ' +
								users[x].nickname +
								' (' +
								pList.length +
								')'
						);
					}
				}

				// Server logs
				if (pList.length === 0) {
					console.log('#' + currentRoom.number + ' - Room deleted, no more players');
					//delete currentRoom;
				} else {
					if (newOwner !== currentOwner) {
						console.log('-- New owner : ' + pList[0]);
					}
				}

				//Delete the user
				let leftModal = {
					nickname: users[x].nickname,
					owner: newOwner
				};

				io.to(currentRoom.number).emit('playerleft', leftModal);
				io.to(currentRoom.number).emit('viewclient', currentRoom);
				delete users[x];
			}
		}
	});
});

/* setInterval(function() {
	io.to('room1').emit('state', players);
}, 1000 / 60); */
