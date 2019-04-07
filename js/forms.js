var filterN = /^[A-Za-z0-9]{3,}$/;
var filterR = /^[A-Za-z]{4}$/;

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
