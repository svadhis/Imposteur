var filterN = /^[A-Za-z0-9]{3,}$/;
var filterR = /^[A-Za-z]{4}$/;

if (Cookies.get('language')) {
	lang = Cookies.get('language');
} else {
	lang = 'french';
}

// Handle enter keypress

function handleEnterRoom(e) {
	var keycode = e.keyCode ? e.keyCode : e.which;
	if (keycode == '13') {
		joinRoom();
	}
}

function handleEnterNickname(e) {
	var keycode = e.keyCode ? e.keyCode : e.which;
	if (keycode == '13') {
		document.querySelector('#room').focus();
	}
}

// Initial template
document.querySelector('main').innerHTML = `
	<div id="main">
		<div class="row">
			<form>
				<div class="col s12">

					<div id="nickname-area" class="input-field col s12" onClick="document.querySelector('#nickname').focus();">
						<input id="nickname" type="text" pattern="[A-Za-z0-9]{3,}" class="validate" required=""
							aria-required="true" onkeypress="handleEnterNickname(event)">
						<label for="text">${ifc.home.nicknamelabel[lang]}</label>
						<span class="helper-text" data-error="${ifc.home.nicknameerror[lang]}"
							data-success=""></span>
					</div>
				</div>
				<div class="col s12 l6 white">
					<h5 class="center-align">${ifc.home.joingame[lang]}</h5>

					<div id="room-area" class="input-field col s12" onClick="document.querySelector('#room').focus();">
						<input id="room" type="text" pattern="[A-Za-z]{4}" class="validate" required="" aria-required="true" onkeypress="handleEnterRoom(event)">
						<label for="text">${ifc.home.roomlabel[lang]}</label>
						<span class="helper-text" data-error="4 characters. Only letters" data-success=""></span>
					</div>
					<div class="input-field col s12 center-align">
						<a id="rejoindre" class="waves-effect waves-light btn-small disabled" onClick="joinRoom();">${ifc.home.joinbutton[
							lang
						]}</a>
					</div>

				</div>
				<div class="col s12 l6">

					<h5 class="center-align">${ifc.home.startgame[lang]}</h5>
					<div class="input-field col s12 select">
						<select id="language" required="" aria-required="true" onchange="createChecks();">
							<option value="" disabled selected>${ifc.home.chooselanguage[lang]}</option>
							<option value="french">Français</option>
							<option value="english">English</option>
							<option value="spanish">Español</option>
						</select>
					</div>
					<div class="input-field col s12 center-align">
						<a id="creation" class="waves-effect waves-light btn-small disabled" onClick="createRoom();">${ifc.home
							.createbutton[lang]}</a>
					</div>

				</div>
			</form>
		</div>
	</div>
	`;

document.querySelector('.modal-content').innerHTML = `
	<h5 class="center-align">WhoFakesIt</h5>
	<p>${ifc.home.modal[lang]}</p>
	`;

//Set default nickname
if (Cookies.get('username')) {
	$('input[id=nickname]').val(Cookies.get('username'));
}

//Set default language
if (Cookies.get('language')) {
	$('select[id=language]').val(Cookies.get('language'));
	if (filterN.test($('input[id=nickname]').val())) {
		$('a[id=creation]').removeClass('disabled');
	}
}

// Create form filters
function createChecks() {
	if (filterN.test($('input[id=nickname]').val()) && $('select[id=language]').val() !== null) {
		console.log($('select[id=language]').val());
		$('a[id=creation]').removeClass('disabled');
	} else {
		$('a[id=creation]').addClass('disabled');
	}
}

// Join form filters

$('form').keyup(function() {
	if (filterN.test($('input[id=nickname]').val()) && filterR.test($('input[id=room]').val())) {
		$('a[id=rejoindre]').removeClass('disabled');
	} else {
		$('a[id=rejoindre]').addClass('disabled');
	}

	createChecks();
});
