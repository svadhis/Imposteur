$(document).ready(function() {
	$('select').formSelect();
});
var socket = io();

//my ID
let userid = '';
let username = '';
let owner = 0;
let lang = '';
let myRoom = '';
let baseTimer;
let divTimer = `<div id="myProgress" class="purple lighten-5">
<div id="myBar" class="purple lighten-3"></div>
</div>`;

let questions = {
	raiseq: cardsRaise,
	pointq: cardsPoint,
	countq: cardsCount,
	faceq: cardsFace
};

if (!Cookies.get('userid')) {
	userid = [ ...Array(16) ].map((i) => (~~(Math.random() * 36)).toString(36)).join('');
	Cookies.set('userid', userid, { expires: 7 });
} else {
	userid = Cookies.get('userid');
}

// Timer bar
function timerBar(s) {
	var elem = document.getElementById('myBar');
	var width = 1;
	var id = setInterval(frame, s * 10);
	function frame() {
		if (width >= 100) {
			clearInterval(id);
		} else {
			width++;
			elem.style.width = width + '%';
		}
	}
}

function joinRoom() {
	var joinData = {
		number: document.querySelector('#room').value.toLowerCase(),
		nickname: document.querySelector('#nickname').value,
		userid: userid
	};

	if (!Cookies.get('username')) {
		Cookies.set('username', joinData.nickname, { expires: 7 });
	} else if (Cookies.get('username') !== joinData.nickname) {
		Cookies.remove('username');
		Cookies.set('username', joinData.nickname, { expires: 7 });
	}

	username = Cookies.get('username');
	socket.emit('joinroom', joinData);
}

function createRoom() {
	var createData = {
		language: document.querySelector('#language').value,
		nickname: document.querySelector('#nickname').value,
		userid: userid
	};

	if (!Cookies.get('username')) {
		Cookies.set('username', createData.nickname, { expires: 7 });
	} else if (Cookies.get('username') !== createData.nickname) {
		Cookies.remove('username');
		Cookies.set('username', createData.nickname, { expires: 7 });
	}

	if (!Cookies.get('language')) {
		Cookies.set('language', createData.language, { expires: 7 });
	} else if (Cookies.get('language') !== createData.language) {
		Cookies.remove('language');
		Cookies.set('language', createData.language, { expires: 7 });
	}

	username = Cookies.get('username');
	socket.emit('createroom', createData);
}

// Socket emit function
function ioSend(query) {
	socket.emit(query, myRoom);
}

// Choose game function
function chooseGame(e) {
	clearTimeout(baseTimer);
	myRoom.view = e.id;
	document.querySelectorAll('.game').forEach((game) => {
		game.style.outline = '';
	});
	e.style.outline = '4px solid purple';
	document.querySelector('#choice').innerText = ifc.gamelist[e.id + 'q'][lang] + '...';
	document.querySelector('#timer').innerHTML = divTimer;
	timerBar(2);
	baseTimer = setTimeout(function() {
		ioSend('currentgame');
	}, 2000);
}

//Countdown
function countdown(data) {
	document.querySelector('main').innerHTML = `
		<div class="center-align row">
			<div class="col s12 fullv">
				<span class="font2 purple-text text-darken-2 bigger">3</span>
			</div>
		</div>
	`;
	setTimeout(function() {
		document.querySelector('main').innerHTML = `
		<div class="center-align row">
			<div class="col s12 fullv">
				<span class="font2 purple-text text-darken-2 bigger">2</span>
			</div>
		</div>
		`;
		setTimeout(function() {
			document.querySelector('main').innerHTML = `
			<div class="center-align row">
				<div class="col s12 fullv">
					<span class="font2 purple-text text-darken-2 bigger">1</span>
				</div>
			</div>
			`;
			setTimeout(function() {
				document.querySelector('main').innerHTML = `
				<div class="center-align row white">
					<div id="timer" class="col s12 center-align white">
						${divTimer}
					</div>
					<div class="col s12">
						<span class="font2 purple-text text-darken-2 big">GO</span>
					</div>
				</div>
				`;
				timerBar(3);
				setTimeout(function() {
					let readQuestion = '';
					let roomReader = data.readerrand[data.round];
					if (data.playerscore[roomReader].nickname === username) {
						readQuestion = `
						<div class="col s12 white">
							<h4 class="purple-text text-darken-2 big">${ifc.ingame.readq[lang]}</h4>
						</div>
						<div class="col s12">
							<h3 class="big">${ifc.gamelist[data.view][lang]}</h3>
							<h4 class="big">${questions[data.view][data.randomq][lang]}</h4>
						</div>
						`;
					} else {
						readQuestion = '';
					}
					document.querySelector('main').innerHTML = `
					<div class="center-align row font2 purple-text text-darken-2">
						<div id="timer" class="col s12 center-align white">
						${divTimer}
						</div>
						${readQuestion}
					</div>
					`;
					timerBar(5);
				}, 3000); // 3000
			}, 800); // 800
		}, 800); // 800
	}, 800); // 800
}

// Templates
socket.on('viewclient', function(room) {
	let elem = ifc[room.view];
	myRoom = room;
	lang = room.language;

	let ownerOnly = '';

	// Lobby template
	if (room.view === 'lobby') {
		if (room.playerlist[0] === username) {
			owner = 1;
			let canStart = 'disabled';
			// Minimum players to start the game
			if (room.playerlist.length > 0) {
				canStart = '';
			}
			ownerOnly = `
		<div class="col s12 center-align">
			<a class="waves-effect waves-light btn-small purple lighten-1 ${canStart}" onClick="ioSend('startroom');">${elem
				.startbutton[lang]}</a>
		</div>
	`;
		}

		let allPlayers = '';
		for (i = 0; i < room.playerlist.length; i++) {
			allPlayers += `<li><h5>${i + 1} - ${room.playerlist[i]}</h5></li>`;
		}

		document.querySelector('main').innerHTML = `
		<div class="row font2 purple-text text-darken-2">
			<div class="col s12 center-align">
				<h3>${elem.title[lang]}</h3>
			</div>
			<div class="col s12 center-align white">
				<h1>#${room.number.toUpperCase()}</h1>
			</div>
			<div class="col s9 offset-s3 playerlist">
				<ul >
				${allPlayers}
				</ul>
			</div>
			${ownerOnly}
		</div>
	`;

		document.querySelector('footer a').innerHTML = ifc.footerlobby.title[lang];
		document.querySelector('.modal-content').innerHTML = `
		<div class="video-container">
			<iframe src="//www.youtube.com/embed/
			${ifc.footerlobby.content[lang]}" frameborder="0" allowfullscreen></iframe>
      	</div>	
		`;
	}

	// Start template
	if (room.view === 'start') {
		let allPlayers = '';
		for (i = 0; i < room.playerlist.length; i++) {
			allPlayers += `<li>${i + 1} - ${room.playerlist[i]}</li>`;
		}

		document.querySelector('main').innerHTML = `
		<div class="row">
			<div id="timer" class="col s12 center-align white">
				${divTimer}
			</div>
			<div class="col s12 center-align white">
				<h2 class="purple-text text-darken-2">${elem[lang]}</h2>
			</div>
			<div class="col s9 offset-s3 playerlist">
				<ul class="purple-text text-darken-2">
				${allPlayers}
				</ul>
			</div>
		</div>
	`;
		timerBar(5);
	}

	// Choose game template
	if (room.view === 'choosegame') {
		let choosing = '';
		let userChoosing = room.playerscore[room.toplay].nickname;
		let gameList = '';
		if (userChoosing === username) {
			choosing = elem.player[lang];
			userChoosing = '';
			gameList = `
		
				<div class="col s6 center-align">
					<img id="raise" class="game" src="http://via.placeholder.com/120" onClick="chooseGame(raise);">
				</div>
				<div class="col s6 center-align">
					<img id="point" class="game" src="http://via.placeholder.com/120" onClick="chooseGame(point);">
				</div>
				<div class="col s6 center-align">
					<img id="count" class="game" src="http://via.placeholder.com/120" onClick="chooseGame(count);">
				</div>
				<div class="col s6 center-align">
					<img id="face" class="game" src="http://via.placeholder.com/120" onClick="chooseGame(face);">
				</div>
				<div class="col s12 center-align">
				<h4 id="choice"></h4>
				</div>
			
			`;
		} else {
			userChoosing = `<h3>${userChoosing}</h3>`;
			choosing = elem.others[lang];
		}

		let rankingPos = '';
		let rankingName = '';
		let rankingScore = '';
		room.playerscore.sort(function(a, b) {
			return b.score - a.score;
		});
		room.playerscore.forEach((player, i) => {
			rankingPos += `<li><h5>${i + 1}</h5></li>`;
			rankingName += `<li><h5>${player.nickname}</h5></li>`;
			rankingScore += `<li><h5>${player.score}</h5></li>`;
		});

		document.querySelector('main').innerHTML = `
		<div class="row font2 purple-text text-darken-2">
			<div id="timer" class="col s12 center-align white">		
			</div>
			<div class="col s12 center-align white">
				${userChoosing}
				<h3>${choosing}</h3>
			</div>
				${gameList}
		</div>
	`;
		document.querySelector('footer a').innerHTML = '#' + room.number.toUpperCase();
		document.querySelector('.modal-content').innerHTML = `
		<div class="row font2 purple-text text-darken-2">
			<div class="col s3">
				<ul>${rankingPos}</ul>
			</div>
			<div class="col s6">
				<ul>${rankingName}</ul>
			</div>
			<div class="col s3 right-align">
				<ul>${rankingScore}</ul>
			</div>
		</div>
		`;
	}

	// Starting game template
	if (room.view === 'raise' || room.view === 'point' || room.view === 'count' || room.view === 'face') {
		document.querySelector('main').innerHTML = `
			<div class="row font2 purple-text text-darken-2">
				<div id="timer" class="col s12 center-align white">		
				</div>
				<div class="col s12 center-align">
					<img class="poster" src="http://via.placeholder.com/180">
				</div>
				<div class="col s12 center-align">
					<h3>${ifc.gamelist[room.view + 'q'][lang]}...</h3>
				</div>
			</div>
		`;
	}

	// Question template

	if (room.view === 'raiseq' || room.view === 'pointq' || room.view === 'countq' || room.view === 'faceq') {
		let question = '';
		let roomFaker = room.fakerrand[room.round];
		if (room.playerscore[roomFaker].nickname === username) {
			question = ifc.faker.youare[lang];
		} else {
			question = questions[room.view][room.randomq][lang];
		}
		document.querySelector('main').innerHTML = `
			<div class="row font2 purple-text text-darken-2">
				<div id="timer" class="col s12 center-align white">
					${divTimer}
				</div>
				<div class="col s12 center-align">
					<img class="poster" src="http://via.placeholder.com/180">
				</div>
				<div class="col s12 center-align">
					<h3>${ifc.gamelist[room.view][lang]}...</h3>
				</div>
				<div class="col s12 center-align white">
					<h3>${question}</h3>
				</div>
			</div>
		`;
		timerBar(8);
	}
});

// Countdown template
socket.on('countdown', function(room) {
	countdown(room);
});

// Modals
socket.on('noroom', function() {
	M.toast({ html: '<h5>' + ifc.modals.noroom.english + '</h5>', classes: 'red z-depth-3' });
});

socket.on('closed', function() {
	M.toast({ html: '<h5>' + ifc.modals.closed.english + '</h5>', classes: 'red z-depth-3' });
});

socket.on('full', function() {
	M.toast({ html: '<h5>' + ifc.modals.full.english + '</h5>', classes: 'red z-depth-3' });
});

socket.on('noname', function() {
	M.toast({ html: '<h5>' + ifc.modals.noname.english + '</h5>', classes: 'red z-depth-3' });
});

socket.on('playerjoined', function(name) {
	if (name !== username) {
		M.toast({ html: '<h5>' + name + ifc.modals.joined[lang] + '</h5>', classes: 'blue z-depth-3' });
	}
});

socket.on('playerleft', function(data) {
	M.toast({ html: '<h5>' + data.nickname + ifc.modals.left[lang] + '</h5>', classes: 'red z-depth-3' });
	if (data.owner === username && owner === 0) {
		M.toast({ html: '<h5>' + ifc.modals.newowner[lang] + '</h5>', classes: 'green z-depth-3' });
	}
});
