

$(document).ready(function () {
	$('select').formSelect();
});
var socket = io();

//my ID
let userid = "";

if (!Cookies.get('userid')) {
	userid = Math.floor(Math.random() * 899999999999) + 100000000000;
	Cookies.set('userid', userid, { expires: 7 });
}
else {
	userid = Cookies.get('userid');
}


//Loading JSON files
const jsonDB = {};
var actual_JSON = "";

function loadJSON(callback, jsonfile) {

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', '/db/' + jsonfile + '.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

function init(jsonfile) {
	loadJSON(function (response) {
		// Parse JSON string into object
		actual_JSON = JSON.parse(response);
		jsonDB[jsonfile] = JSON.parse(response);
	}, jsonfile);
}





/* socket.on('message', function(data) {
	console.log(data);
});

var movement = {
	up: false,
	down: false,
	left: false,
	right: false
};
document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = true;
			break;
		case 87: // W
			movement.up = true;
			break;
		case 68: // D
			movement.right = true;
			break;
		case 83: // S
			movement.down = true;
			break;
	}
});
document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = false;
			break;
		case 87: // W
			movement.up = false;
			break;
		case 68: // D
			movement.right = false;
			break;
		case 83: // S
			movement.down = false;
			break;
	}
}); */

socket.emit('new player');
/* setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60); */




function joinRoom() {
	var joinData = {
		"number": document.querySelector("#room").value,
		"nickname": document.querySelector("#nickname").value,
		"userid": userid
	};
	socket.emit('join room', joinData);
}



function createRoom() {
	var createData = {
		"language": document.querySelector("#language").value,
		"userid": userid
	};
	socket.emit('create room', createData);
}



socket.on('invite owner', function (data) {

	document.querySelector("main").innerHTML = `
		<div class="row">
			<div class="col s12 center-align">
				<h3 class="font2 purple-text text-darken-2">${jsonDB.interface.joinroomtitle[data.language]}</h3>
			</div>
			<div class="col s12 center-align white">
				<h1 class="font2 purple-text text-darken-2">${data.number}</h1>
			</div>
			<div class="col s9 offset-s3 playerlist">
				<ul class="font2 purple-text text-darken-2">
				</ul>
			</div>
		</div>
	`;

});

socket.on('invite player', function (data) {

	document.querySelector("main").innerHTML = `
		<div class="row">
			<div class="col s12 center-align">
				<h3 class="font2 purple-text text-darken-2">${jsonDB.interface.welcometoroom[data.language]}</h3>
			</div>
			<div class="col s12 center-align white">
				<h1 class="font2 purple-text text-darken-2">${data.number}</h1>
			</div>
			<div class="col s9 offset-s3 playerlist">
				<ul class="font2 purple-text text-darken-2">
				</ul>
			</div>
		</div>
	`;

});

socket.on('no room', function () {

	M.toast({ html: "<h5>This room doesn't exist !</h5>", classes: "red z-depth-3" });

});

socket.on('hello', function () {

	M.toast({ html: "<h5>COUCOU !</h5>", classes: "red z-depth-3" });

});





/* var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';
	for (var id in players) {
		var player = players[id];
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();

		if (player.y === 25) {
			document.querySelector('.test').innerHTML = 'ohohohohoh';
		}
	}
}); */
