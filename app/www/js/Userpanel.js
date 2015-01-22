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

	var panelContent =
		'<p>Hallo ' + this.user.username + ',<br />' +
		'Noch gibt es hier keine Funktion, aber schon bald folgt hier mehr! <br />' +
		'<br />' +
		'<button class="ui-shadow ui-btn ui-corner-all" type="submit" id="logout-submit-btn">Ausloggen!</button>';

	$('#userpanel .ui-content').html(panelContent);
	$('#logout-submit-btn').on('click', function (event) {
		event.preventDefault();

		app.loginHandler.logout();
		$.mobile.changePage('');
	});
};