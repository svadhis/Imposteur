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

// var rtId = 1;

/* var players = {};
var activeRooms = {}; */

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
		rooms[roomNumber] = {
			number: roomNumber,
			language: data.language,
			state: 'inlobby',
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
		roomView(socket, roomNumber, data.language, 'viewlobby', data.nickname, '', roomNumber, '');
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

			//joueurs.insert({ userid: data.userid, nickname: data.nickname, activeroom: roomNumber });

			let language = rooms[roomNumber].language;
			let owner = rooms[roomNumber].playerlist[0];

			socket.join(roomNumber);
			roomView(socket, roomNumber, language, 'viewlobby', owner, '', roomNumber, '');
		} else {
			socket.emit('no room');
		}
	});

	socket.on('disconnect', () => {
		for (x in users) {
			//If user was in a room...
			if (users[x].socketid === socket.id) {
				rooms[users[x].room].players -= 1;
				//if no more players in room, delete the room, else decrease number of players
				if (rooms[users[x].room].players === 0) {
					console.log('#' + rooms[users[x].room].number + ' - Room deleted, no more players');
					delete rooms[users[x].room];
				} else {
					console.log(
						'#' +
							rooms[users[x].room].number +
							' - Player left : ' +
							users[x].nickname +
							' (' +
							rooms[users[x].room].players +
							')'
					);
					// Delete from playerlist, send new owner if list[0] changed
					let pList = rooms[users[x].room].playerlist;
					for (i = 0; i < pList.length; i++) {
						if (pList[i] === users[x].nickname) {
							pList.splice(i, 1);
							if (i === 0) {
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
