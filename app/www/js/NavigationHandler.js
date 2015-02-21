var NavigationHandler = function () {
	this.TAG = 'NavHandler => ';
}

NavigationHandler.prototype.refresh = function () {
	var navItem = $('#navpanel #usermenu'),
		navListView = $('#navigationlist');

	navItem.empty();

	if(this.isUserLoggedIn()) {
		console.log(this.TAG + 'user logged in -> show userpanel');
		navItem.append('<a href="#userpanel">Persönlicher Bereich</a>');

	}
	else {
		console.log(this.TAG + 'only guest -> show login');
		navItem.append('<a href="#login">Login / Registrieren</a>');
	}

	navListView.listview('refresh');
}

NavigationHandler.prototype.isUserLoggedIn = function () {
	return app.currentUser.getUserStatus() === UserStatus.USER
}