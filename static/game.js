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
let voted = 0;

let mainColor = ifc.config.playercolors[ifc.config.maincolor] || 'purple';
let mainText = mainColor + '-text text-darken-2 font2';
let playerColors = [];
ifc.config.playercolors.forEach((color, i) => {
	if (i !== ifc.config.maincolor) {
		playerColors.push(color);
	}
});

let baseTimer;
let divTimer = `<div id="myProgress" class="${mainColor} lighten-5">
<div id="myBar" class="${mainColor} lighten-3"></div>
</div>`;

let questions = {
	raiseq: cardsRaise,
	pointq: cardsPoint,
	countq: cardsCount,
	faceq: cardsFace,
	wordq: cardsWord
};

if (!Cookies.get('userid')) {
	userid = [ ...Array(16) ].map((i) => (~~(Math.random() * 36)).toString(36)).join('');
	Cookies.set('userid', userid, { expires: 7 });
} else {
	userid = Cookies.get('userid');
}

//Apply main color
document.querySelector('main').classList.add(mainColor, mainColor + '-text', 'lighten-4', 'font2', 'text-darken-2');
document.querySelector('#rejoindre').classList.add(mainColor);
document.querySelector('#creation').classList.add(mainColor);
document.querySelector('#modal1').classList.add(mainColor + '-text', 'text-darken-2', 'font2');
document.querySelector('footer').classList.add(mainColor, 'darken-2', 'font2');

let cssColor = '';
if (mainColor === 'purple' || mainColor === 'pink') {
	cssColor = 'purple';
	document.documentElement.style.setProperty('--maincolor', cssColor);
} else if (mainColor === 'indigo' || mainColor === 'light-blue') {
	cssColor = 'indigo';
	document.documentElement.style.setProperty('--maincolor', cssColor);
} else if (mainColor === 'teal' || mainColor === 'light-green') {
	cssColor = 'teal';
	document.documentElement.style.setProperty('--maincolor', cssColor);
} else if (mainColor === 'amber' || mainColor === 'deep-orange') {
	cssColor = 'orange';
	document.documentElement.style.setProperty('--maincolor', cssColor);
} else {
	cssColor = 'grey';
	document.documentElement.style.setProperty('--maincolor', cssColor);
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
			<a class="waves-effect waves-light btn-small ${mainColor} lighten-1 ${canStart}" onClick="ioSend('startroom');">${elem
				.startbutton[lang]}</a>
		</div>
	`;
		}

		let allPlayers = '';
		for (i = 0; i < room.playerlist.length; i++) {
			allPlayers += `
			<div class="col s6">
			<h5>${i + 1} - ${room.playerlist[i]}</h5>
			</div>
			`;
		}

		// templateRow(rowId, timer, custom)
		templateRow(1, 0, 'center-align');

		//templateCol(rowId, colId, size, inner, custom)
		templateCol(1, 1, 12, `<h3>${elem.title[lang]}</h3>`);
		templateCol(1, 2, 12, `<h1>#${room.number.toUpperCase()}</h1>`, 'white');
		templateCol(1, 3, 12, `<div class="row">${allPlayers}</div>`, 'playerlist left-align');
		templateCol(1, 4, 12, ownerOnly);

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

		templateRow(1, 2, 'center-align');

		templateCol(1, 1, 12, `<h2>${elem[lang]}</h2>`, 'white');
		templateCol(1, 2, 9, `<ul>${allPlayers}</ul>`, 'offset-s3 playerlist left-align');

		timerBar(5);
	}

	// Choose game template
	if (room.view === 'choosegame') {
		if (room.playerlist[0] === username) {
			let sound = document.querySelector('#beep1');
			sound.play();
		}
		voted = 0;
		let choosing = '';
		let userChoosing = room.playerscore[room.toplay].nickname;
		let gameList = '';
		if (userChoosing === username) {
			choosing = elem.player[lang];
			userChoosing = '';
			gameList = `
		
				<div class="col s6 center-align">
					<img id="raise" class="game" src="/img/raiseq.jpg" onClick="chooseGame(raise);">
				</div>
				<div class="col s6 center-align">
					<img id="point" class="game" src="/img/pointq.jpg" onClick="chooseGame(point);">
				</div>
				<div class="col s6 center-align">
					<img id="count" class="game" src="/img/countq.jpg" onClick="chooseGame(count);">
				</div>
				<div class="col s6 center-align">
					<img id="face" class="game" src="/img/faceq.jpg" onClick="chooseGame(face);">
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

		templateRow(1, 1, 'center-align');

		templateCol(1, 1, 12, `${userChoosing}<h3>${choosing}</h3>`, 'white');
		templateCol(1, 2, 12, gameList);

		document.querySelector('footer a').innerHTML = '#' + room.number.toUpperCase();
		document.querySelector('.modal-content').innerHTML = `
		<div class="row ${mainText}">
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
		templateRow(1, 1, 'center-align');

		templateCol(1, 1, 12, `<img class="poster" src="/img/${room.view}q.jpg">`);
		templateCol(1, 2, 10, `<h4>${ifc.gamelist[room.view + 'q'].detail[lang]}</h4>`, 'offset-s1 left-align');
	}

	// Starting finale template
	if (room.view === 'word') {
		templateRow(1, 2, 'center-align');

		templateCol(1, 1, 12, `<img class="poster" src="/img/wordq.jpg">`);
		templateCol(1, 2, 10, `<h4>${ifc.gamelist.wordq.detail[lang]}</h4>`, 'offset-s1 left-align');

		timerBar(6);
		let qLength = questions[myRoom.view + 'q'].length;
		baseTimer = setTimeout(function() {
			let chooseData = {
				room: myRoom,
				qlength: qLength
			};
			socket.emit('currentgame', chooseData);
		}, 6200);
	}

	// Question template

	if (
		room.view === 'raiseq' ||
		room.view === 'pointq' ||
		room.view === 'countq' ||
		room.view === 'faceq' ||
		room.view === 'wordq'
	) {
		let question = '';
		let currentGame = '';
		let roomFakerId = room.fakerrand[room.round];
		let roomFaker = room.playerscore[roomFakerId].nickname;
		if (roomFaker === username) {
			currentGame = '';
			question = ifc.faker.youare[lang];
		} else {
			currentGame = ifc.gamelist[room.view][lang] + '...';
			question = questions[room.view][room.randomq][lang];
		}
		templateRow(1, 2, 'center-align');

		templateCol(1, 1, 12, `<img class="poster" src="/img/${room.view}.jpg">`);
		templateCol(1, 2, 12, `<h3>${currentGame}</h3>`);
		templateCol(1, 3, 12, `<h3>${question}</h3>`, 'white');

		timerBar(8);
	}

	// Vote for faker
	if (room.view === 'vote') {
		let roomFakerId = room.fakerrand[room.round];
		let roomFaker = room.playerscore[roomFakerId].nickname;
		let playerButtons = '';
		room.playerscore.forEach((player, i) => {
			if (player.nickname !== username) {
				playerButtons += `
				<div class="col s6 center-align">
					<a id="${player.nickname}" class="waves-effect waves-light btn ${ifc.config.playercolors[
					i
				]} lighten-1 mtop1" onClick="ioSendVote('${player.nickname}');"><h5>${player.nickname}</h5></a>
				</div>
				`;
			}
		});

		templateRow(1, 1, 'center-align');

		if (roomFaker !== username) {
			templateCol(1, 1, 12, `<h4>${ifc.ingame.votetitle[lang]}...</h4>`, 'white');
			templateCol(1, 2, 12, `${playerButtons}`);
		} else {
			templateCol(1, 1, 12, `<h4>${ifc.ingame.fakevote[lang]}...</h4>`, 'white');
		}
	}

	// Reveal faker
	if (room.view === 'reveal') {
		let roomFakerId = room.fakerrand[room.round - 1];
		let roomFaker = room.playerscore[roomFakerId].nickname;

		templateRow(1, 1, 'center-align');

		templateCol(1, 1, 12, `<h4>${ifc.ingame.reveal[lang]}...</h4>`, 'white');
		templateCol(1, 2, 12, `<h3 id="faker"></h3>`);

		setTimeout(function() {
			document.querySelector('#timer').innerHTML = divTimer;
			document.querySelector('#faker').innerHTML = roomFaker;
			timerBar(4);
		}, 2000); //2000
	}

	// Don't reveal faker
	if (room.view === 'noreveal') {
		templateRow(1, 2, 'center-align');

		templateCol(1, 1, 12, `<h4>${ifc.ingame.notfound[lang]}</h4>`, 'white');

		timerBar(6);
	}

	// Show scores
	if (room.view === 'scoreupdate') {
		let roomFakerId = room.fakerrand[room.round - 1];
		let roomFaker = room.playerscore[roomFakerId].nickname;
		let fakerScore = room.bufferscore[roomFakerId].added;
		let scorePlayer = '';
		let scorePts = '';

		room.bufferscore.forEach((player) => {
			if (player.nickname !== roomFaker) {
				scorePlayer += `<h4>${player.nickname}</h4>`;
				scorePts += `<h4>+ ${player.added}</h4>`;
			}
		});

		templateRow(1, 2, 'center-align');

		templateCol(1, 1, 6, `${scorePlayer}<h3 class="white-text">${roomFaker}</h3>`, 'left-align');
		templateCol(1, 2, 6, `${scorePts}<h3 class="white-text">+ ${fakerScore}</h3>`, 'right-align');

		timerBar(6);
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
