var User = function () {
	this.TAG = 'User => ';

	this.username = null;
	this.password = null;
	this.status = UserStatus.GUEST;

	this.load();
}

User.prototype.load = function () {
	if(window.localStorage =! null) {
		var user = JSON.parse(window.localStorage.getItem('session'));

		if(user !== null) {
			this.username = user.username;
			this.password = user.password;
			this.status = user.status;

			console.log(this.TAG + 'successfully restored user session');
		}
		else
			console.log(this.TAG + 'no user session exist in localStorage');
	}
}

User.prototype.getCurrentUser = function () {
	return {
		'username' : this.username,
		'password' : this.password,
		'status' : this.status
	};
}

User.prototype.setCurrentUser = function (user) {
	this.username = user.username;
	this.password = user.password;
	this.status = user.status;
}

User.prototype.clearCurrentUser = function () {
	this.username = null;
	this.password = null;
	this.status = UserStatus.GUEST;
}

User.prototype.getUserStatus = function () {
	return this.status;
}