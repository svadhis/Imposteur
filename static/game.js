$(document).ready(function() {
	$('select').formSelect();
});
var socket = io();

//my ID
let userid = '';

if (!Cookies.get('userid')) {
	userid = Math.floor(Math.random() * 899999999999) + 100000000000;
	Cookies.set('userid', userid, { expires: 7 });
} else {
	userid = Cookies.get('userid');
}

/* socket.emit('new player');
setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60); */

function joinRoom() {
	var joinData = {
		number: document.querySelector('#room').value,
		nickname: document.querySelector('#nickname').value,
		userid: userid
	};

	if (!Cookies.get('username')) {
		Cookies.set('username', joinData.nickname, { expires: 7 });
	} else if (Cookies.get('username') !== joinData.nickname) {
		Cookies.remove('username');
		Cookies.set('username', joinData.nickname, { expires: 7 });
	}

	socket.emit('join room', joinData);
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

	socket.emit('create room', createData);
}

function lobbyTemplate(data) {
	document.querySelector('main').innerHTML = `
		<div class="row">
			<div class="col s12 center-align">
				<h3 class="font2 purple-text text-darken-2">${interface[data.header][data.language]}</h3>
			</div>
			<div class="col s12 center-align white">
				<h1 class="font2 purple-text text-darken-2">${data.main}</h1>
			</div>
			<div class="col s9 offset-s3 playerlist">
				<ul class="font2 purple-text text-darken-2">
					${data.footer}
				</ul>
			</div>
		</div>
	`;
}

socket.on('invite player', function(data) {
	lobbyTemplate(data);
});

socket.on('no room', function() {
	M.toast({ html: "<h5>This room doesn't exist !</h5>", classes: 'red z-depth-3' });
});
