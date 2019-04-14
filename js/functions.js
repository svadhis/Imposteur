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

// Template Row
function templateRow(rowId, timer, custom = '', inner = '') {
	let timerDiv = '';
	if (timer === 1) {
		timerDiv = `<div id="timer" class="col s12 center-align white"></div>`;
	} else if (timer === 2) {
		timerDiv = `<div id="timer" class="col s12 center-align white">${divTimer}</div>`;
	}

	if (rowId === 1) {
		document.querySelector('main').innerHTML = `
    <div id="row${rowId}" class="row ${custom}">
    ${timerDiv}
    ${inner}
    </div>
    `;
	} else {
		document.querySelector('main').innerHTML += `
    <div id="row${rowId}" class="row ${custom}">
    ${timerDiv}
    ${inner}
    </div>
    `;
	}
}

// Template Col
function templateCol(rowId, colId, size, inner, custom = '') {
	document.querySelector('#row' + rowId).innerHTML += `
    <div id="col${colId}" class="col s${size} ${custom}">
    ${inner}
    </div>
    `;
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

// Socket emit VOTE function
function ioSendVote(faker) {
	voted++;
	if (voted === 1) {
		document.querySelector('#' + faker).style.outline = '4px solid ' + cssColor;
		let voteData = {
			room: myRoom,
			voter: username,
			faker: faker
		};
		socket.emit('vote', voteData);
	} else if (voted === 2) {
		templateCol(1, 7, 12, `<h4>${ifc.ingame.alreadyvoted[lang]}</h4>`);
	}
}

// Choose game function
function chooseGame(e) {
	clearTimeout(baseTimer);
	myRoom.view = e.id;
	document.querySelectorAll('.game').forEach((game) => {
		game.style.outline = '';
	});
	e.style.outline = '6px solid ' + cssColor;
	document.querySelector('#choice').innerText = ifc.gamelist[e.id + 'q'][lang] + '...';
	document.querySelector('#timer').innerHTML = divTimer;
	let qLength = questions[myRoom.view + 'q'].length;
	timerBar(2);
	baseTimer = setTimeout(function() {
		let chooseData = {
			room: myRoom,
			qlength: qLength
		};
		socket.emit('currentgame', chooseData);
	}, 2100);
}

//Countdown
function countdown(data) {
	if (data.playerlist[0] === username) {
		let sound = document.querySelector('#beep2');
		sound.play();
	}

	templateRow(1, 0, 'center-align');

	templateCol(1, 1, 12, `<span class="bigger">3</span>`, 'fullv');

	setTimeout(function() {
		if (data.playerlist[0] === username) {
			let sound = document.querySelector('#beep2');
			sound.play();
		}

		templateRow(1, 0, 'center-align');

		templateCol(1, 1, 12, `<span class="bigger">2</span>`, 'fullv');

		setTimeout(function() {
			if (data.playerlist[0] === username) {
				let sound = document.querySelector('#beep2');
				sound.play();
			}

			templateRow(1, 0, 'center-align');

			templateCol(1, 1, 12, `<span class="bigger">1</span>`, 'fullv');

			setTimeout(function() {
				if (data.playerlist[0] === username) {
					let sound = document.querySelector('#button');
					sound.play();
				}

				templateRow(1, 2, 'center-align white');

				templateCol(1, 1, 12, `<span class="big">GO</span>`);

				timerBar(3);
				setTimeout(function() {
					if (data.playerlist[0] === username) {
						let sound = document.querySelector('#beep1');
						sound.play();
					}

					let roomReader = data.readerrand[data.toplay];

					templateRow(1, 1, 'center-align');

					if (data.playerscore[roomReader].nickname === username) {
						let tmpLink = `<a class="waves-effect waves-light btn-small ${mainColor} lighten-1 mtop1" onClick="ioSend('startvote');">${ifc
							.ingame.votebutton[lang]}</a>`;

						templateCol(1, 1, 12, `<h4 class="${mainText} big">${ifc.ingame.readq[lang]}</h4>`, 'white');
						templateCol(1, 2, 12, `<h3 class="big">${ifc.gamelist[data.view][lang]}</h3>`);
						templateCol(1, 3, 12, `<h4 class="big">${questions[data.view][data.randomq][lang]}</h4>`);
						templateCol(1, 4, 12, tmpLink);
					}
				}, 3000); // 3000
			}, 800); // 800
		}, 800); // 800
	}, 800); // 800
}
