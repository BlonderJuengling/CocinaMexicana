var LoginHandler = function () {
	this.TAG = 'LoginHandler => ';

	this.user = username;
	this.pass = password;
	this.status = UserStatus.GUEST;
	this.errors = new Array();
}

LoginHandler.prototype.login = function () {
	this.setCredentialsFromForm();

	if(!this.isValid()) {
		this.showError();
		return;
	}

	var user = {
		'username' : this.username,
		'password' : this.password,
		'status' : this.status
	};

	this.writeLocalStorage(user);
	app.currentUser.setCurrentUser(user);
	app.navHandler.refresh();

	// redirect to home / userportal
}

LoginHandler.prototype.setCredentialsFromForm = function () {
	this.user = $('#login-form #login-username').val();
	this.pass = $('#login-form #login-password').val();
}

LoginHandler.prototype.isValid = function (event) {
	// here do ajax request on backend zu validate user credentials
	// ...

	this.status = UserStatus.USER;

	return true;
}

LoginHandler.prototype.showError = function () {
	console.log(this.TAG + 'show error handling here :)');
}

LoginHandler.prototype.writeLocalStorage = function (user) {
	if(window.localStorage != null) {
		var session = JSON.parse(window.localStorage.getItem('session'));

		if(session == null) {
			localStorage.setItem('session', JSON.stringify(
				{ 'username' : user.username, 'password' : user.password, status: user.status }));

			console.log(this.TAG + 'session data stored in LocalStorage');
		}
		else if(session.username === username) {
			console.log(this.TAG + 'session for user "%s" already exist -> nothing to do', username);
		}
		else {
			console.log(this.TAG + 'Ups! Something went wrong. Session for other user already exists');
		}
	}
	else {
		console.log(this.TAG + 'localStorage not available, can\'t handle user session');
	}
}

LoginHandler.prototype.logout = function () {
	this.clearLocalStorage();
	app.currentUser.clearCurrentUser();
	app.navHandler.refresh();
}

LoginHandler.prototype.clearLocalStorage = function () {
	if(window.localStorage != null) {
		window.localStorage.clear('session');
	}
}

