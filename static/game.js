$(document).ready(function() {
	$('select').formSelect();
});
var socket = io();

//my ID
let userid = '';
let owner = 0;

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

function mainTemplate(data) {
	let ownerOnly = '';

	if (owner === 1) {
		ownerOnly = `
		<${interface[data.view].owner.htmltag}
		class="${interface[data.view].owner.htmlclass}">
		${interface[data.view].owner[data.language]}
		</${interface[data.view].owner.htmltag}>
		`;
	}

	document.querySelector('main').innerHTML = `
		<div class="row">

			<div class="col s12 center-align bodyheader">
				<${interface[data.view].header.htmltag}
				class="${interface[data.view].header.htmlclass}">
				${interface[data.view].header[data.language]}
				</${interface[data.view].header.htmltag}>

				<${interface[data.view].header.htmltag}
				class="${interface[data.view].header.htmlclass}">
				${data.header}
				</${interface[data.view].header.htmltag}>
			</div>

			<div class="col s12 center-align white bodymain">
				<${interface[data.view].main.htmltag}
				class="${interface[data.view].main.htmlclass}">
				${interface[data.view].main[data.language]}
				</${interface[data.view].main.htmltag}>

				<${interface[data.view].main.htmltag}
				class="${interface[data.view].main.htmlclass}">
				${data.main}
				</${interface[data.view].main.htmltag}>
			</div>

			<div class="col s12 center-align bodyfooter">
				<${interface[data.view].footer.htmltag}
				class="${interface[data.view].footer.htmlclass}">
				${interface[data.view].footer[data.language]}
				</${interface[data.view].footer.htmltag}>

				<${interface[data.view].footer.htmltag}
				class="${interface[data.view].footer.htmlclass}">
				${data.footer}
				</${interface[data.view].footer.htmltag}>
				${ownerOnly}
			</div>

		</div>
	`;
}

socket.on('inviteplayer', function(data) {
	if (data.owner === userid) {
		owner = 1;
	}
	mainTemplate(data);
});

socket.on('no room', function() {
	M.toast({ html: "<h5>This room doesn't exist !</h5>", classes: 'red z-depth-3' });
});

/* socket.on('state', function(data) {
	console.log(data.owner);
}); */
