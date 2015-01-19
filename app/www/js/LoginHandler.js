var LoginHandler = function () {
	this.TAG = 'LoginHandler => ';

	this.user = username;
	this.pass = password;
	this.status = UserStatus.GUEST;
	this.errors = new Array();
}

LoginHandler.prototype.login = function () {
	this.errors = []; // clear array with old error information
	this.clearErrorLabels();
	this.setCredentialsFromForm();

	if(!this.isValidInput()) {
		this.showError();
		return;
	}

	this.validateCredentials(this.user, this.pass);
}

LoginHandler.prototype.setCredentialsFromForm = function () {
	this.user = $('#login-form #login-username').val();
	this.pass = $('#login-form #login-password').val();
}

LoginHandler.prototype.isValidInput = function (event) {
	if(this.user === '')
		this.errors.push({ 'field' : 'username', 'msg' : 'Bitte gib deinen Benutzernamen ein' });
	if(this.pass === '')
		this.errors.push({ 'field' : 'password', 'msg' : 'Bitte gib dein Passwort ein' });

	if(this.errors.length > 0)
		return false;

	return true;
}

LoginHandler.prototype.validateCredentials = function(username, password) {
	var self = this,
		request = $.ajax({
			type: 'POST',
			url: 'http://localhost/cocina/api/v1/login',
			data: { 'username' : username, 'password' : password},
		});

	request.done(function (response) {
		if(response.error) {
			$('#error-login-username').text('Ungültiger Benutzername / Passwort');
			return;
		}

		var user = response.account;
			user.status = UserStatus.USER;

		self.writeLocalStorage(user);
		self.clearForm();
		app.currentUser.setCurrentUser(user);
		app.navHandler.refresh();

		$.mobile.changePage('#userpanel');
	});

	request.fail(function (jqXHR, status) {
		console.log(self.TAG + 'Error | Status: ' + status + '; jqXHR: ' + JSON.stringify(jqXHR));
	});
};

LoginHandler.prototype.showError = function () {
	for(var item in this.errors) {
		var error = this.errors[item];
		$('#error-login-' + error.field).text(error.msg);
	}
}

LoginHandler.prototype.clearErrorLabels = function() {
	$('#login-form .form-error').text('');
};

LoginHandler.prototype.clearForm = function() {
	$('#login-form').trigger('reset');
};

LoginHandler.prototype.writeLocalStorage = function (user) {
	if(window.localStorage != null) {
		var session = JSON.parse(window.localStorage.getItem('session'));

		if(session == null) {
			localStorage.setItem('session', JSON.stringify(user));

			console.log(this.TAG + 'session data stored in LocalStorage');
		}
		else if(session.username === user.username) {
			console.log(this.TAG + 'session for user "%s" already exist -> nothing to do', user.username);
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

