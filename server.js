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
app.use('/js', express.static('js'));

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

// Socket on
io.on('connection', function(socket) {
	// Create room
	socket.on('createroom', function(data) {
		if (data.nickname !== 'toplay') {
			let i = 0;
			let roomNumber = '';
			// Check if room id is taken
			while (i < 1) {
				roomNumber = [ ...Array(4) ].map((i) => (~~(Math.random() * 26 + 10)).toString(36)).join('');
				if (!rooms[roomNumber]) i = 1;
			}
			rooms[roomNumber] = {
				number: roomNumber,
				language: data.language,
				view: 'lobby',
				playerlist: [ data.nickname ],
				open: 1,
				round: 1,
				streak: 1,
				randomq: 0,
				toplay: 0
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
		} else {
			socket.emit('noname');
		}
	});

	// Join room
	socket.on('joinroom', function(data) {
		if (data.nickname !== 'toplay') {
			let roomNumber = data.number;
			if (rooms[roomNumber]) {
				if (rooms[roomNumber].open === 1) {
					if (rooms[roomNumber].playerlist.length < 6) {
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
						socket.emit('full');
					}
				} else {
					socket.emit('closed');
				}
			} else {
				socket.emit('noroom');
			}
		} else {
			socket.emit('noname');
		}
	});

	//Start room
	socket.on('startroom', function(data) {
		rooms[data.number].playerscore = [];
		// Randomize playerlist and create object playerscore
		let playerRand = [];
		rooms[data.number].playerlist.forEach((player) => {
			playerRand.push(player);
		});
		playerRand.sort(function() {
			return 0.5 - Math.random();
		});

		playerRand.forEach((player) => {
			rooms[data.number].playerscore.push({
				nickname: player,
				score: 0
			});
		});

		// Randomize player order for faker and reader
		rooms[data.number].fakerrand = [ ...Array(9) ].map(
			(i) => ~~(Math.random() * rooms[data.number].playerlist.length)
		);

		rooms[data.number].readerrand = [ ...Array(9) ].map(
			(i) => ~~(Math.random() * rooms[data.number].playerlist.length)
		);

		rooms[data.number].view = 'start';
		io.to(data.number).emit('viewclient', rooms[data.number]);
		//Then chosing game for first player
		setTimeout(function() {
			rooms[data.number].view = 'choosegame';
			io.to(data.number).emit('viewclient', rooms[data.number]);
		}, 500); //5000
	});

	// Current game
	socket.on('currentgame', function(data) {
		// Prepare next player to choose game
		if (rooms[data.number].toplay < rooms[data.number].playerlist.length) {
			rooms[data.number].toplay++;
		} else {
			rooms[data.number].toplay === 0;
		}

		rooms[data.number].view = data.view;
		io.to(data.number).emit('viewclient', rooms[data.number]);
		//Then sending the question
		setTimeout(function() {
			rooms[data.number].view = data.view + 'q';
			io.to(data.number).emit('viewclient', rooms[data.number]);
			setTimeout(function() {
				io.to(data.number).emit('countdown', rooms[data.number]);
				setTimeout(function() {
					io.to(data.number).emit('viewclient', rooms[data.number]);
				}, 1000); //10400
			}, 1000); //8000
		}, 1000); //3000
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
