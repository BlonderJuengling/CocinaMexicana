var User = function () {
	this.TAG = 'User => ';
	this.user = null;

	this.load();
}

User.prototype.load = function () {
	if(window.localStorage =! null) {
		var userInStore = JSON.parse(window.localStorage.getItem('session'));

		if(userInStore !== null) {
			this.setCurrentUser(userInStore);

			console.log(this.TAG + 'successfully restored user session');
		}
		else
			console.log(this.TAG + 'no user session exist in localStorage');
	}
}

User.prototype.getCurrentUser = function () {
	return this.user;
}

User.prototype.setCurrentUser = function (user) {
	this.user = user;
}

User.prototype.clearCurrentUser = function () {
	this.user = null;
}

User.prototype.getUserStatus = function () {
	if(this.user == null)
		return UserStatus.GUEST;

	return this.user.status;
}

User.prototype.getUsername = function() {
	return this.user.username;
};

User.prototype.isLoggedIn = function() {
	if(this.getCurrentUser() === null)
		return false;

	return true;
};

User.prototype.setClassQuiz = function(value) {
	this.user.class_quiz_done = value;
	this.updateQuizHint(value);
};

User.prototype.updateQuizHint = function(isQuizDone) {
	if(isQuizDone)
		$('.hint-quiz').hide();
	else
		$('.hint-quiz').show();
};

User.prototype.isClassQuizDone = function() {
	if(this.user.class_quiz_done != 0)
		return true;

	return false;
};