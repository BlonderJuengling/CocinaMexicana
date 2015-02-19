var Userpanel = function () {
	this.TAG = 'Userpanel => ';
	this.user = null;
}

Userpanel.prototype.setUser = function(user) {
	if(this.user === null)
		this.user = user;
};

Userpanel.prototype.open = function() {
	if(!this.user.isLoggedIn()) {
		$.mobile.changePage('#login');
		return;
	}

	$('#userpanel .ui-content').html(this.buildUserpanelPage());

	if(!this.user.isClassQuizDone()) {
		$('#userpanel .hint-quiz').show();
	}

	$('#logout-submit-btn').on('click', function (event) {
		event.preventDefault();

		app.loginHandler.logout();
		$.mobile.changePage('');
	});
};

Userpanel.prototype.buildUserpanelPage = function() {
	var panelContent = '';

	panelContent += '<h2>Hallo ' + this.user.getUsername() + ',</h2>';
	panelContent += this.appendClassQuizHint(this.user.isClassQuizDone());
	panelContent += '<p>Noch gibt es hier keine Funktion, aber schon bald folgt hier mehr! <br />' +
		'<br />' +
		'<button class="ui-shadow ui-btn ui-corner-all" data-theme="b" type="submit" id="logout-submit-btn">Ausloggen!</button>' +
		'<p>&nbsp;</p>';

	panelContent += this.appendUserForDebugging(this.user.getCurrentUser());

	return panelContent;
};

Userpanel.prototype.appendClassQuizHint = function(isQuizDone) {
	return '<div class="hint-quiz">Du hast bisher noch nicht unser Einstufungsquiz gespielt.' +
		'Bitte hol dies schnellstmöglich nach, damit wir eine Einschätzung haben, wie gut du dich bereits ' +
		'in der mexikanischen Küche auskennst.<br /><br />' +
		'<a href="#classQuiz">Hier gehts zum Quiz</a></div>';
};

Userpanel.prototype.appendUserForDebugging = function(user) {
	return '<span class="debugging-info">' + JSON.stringify(user) + '</span>';
};