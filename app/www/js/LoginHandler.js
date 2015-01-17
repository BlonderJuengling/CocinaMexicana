var LoginHandler = function () {
	this.TAG = 'LoginHandler => ';

	this.user = username;
	this.pass = password;
	this.success = false;
	this.error = new Array();
}

LoginHandler.prototype.validateUserCredentials = function (event) {
	var loginData = {
		'username' : $('#login-form #login-username').val(),
		'password' : $('#login-form #login-password').val(),
		'status' : UserStatus.USER
	};

	event.preventDefault();

	// here do ajax request on backend zu validate user credentials
	// ...

	// don't unterstand why "this.loginUser" not working
	// maybe wrong context, because method called from on-click listener?
	app.loginHandler.loginUser(loginData.username, loginData.password, loginData.status);
}

LoginHandler.prototype.loginUser = function (username, password, status) {
	var user = {
		'username' : username,
		'password' : password,
		'status' : status
	};

	this.writeLocalStorage(user);
	app.currentUser.setCurrentUser(user);
	app.navHandler.refresh();

	// redirect to home / userportal
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

LoginHandler.prototype.logoutUser = function () {
	this.clearLocalStorage();
	app.currentUser.clearCurrentUser();
	app.navHandler.refresh();
}

LoginHandler.prototype.clearLocalStorage = function () {
	if(window.localStorage != null) {
		window.localStorage.clear('session');
	}
}