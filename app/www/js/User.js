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

User.prototype.getUserId = function() {
	return this.user.id;
};

User.prototype.getUsername = function() {
	return this.user.username;
};

User.prototype.getApiKey = function() {
	return this.user.api_key;
};

User.prototype.isLoggedIn = function() {
	if(this.getCurrentUser() === null)
		return false;

	return true;
};

User.prototype.setCurrentRank = function(rankId) {
	this.user.rank_id = rankId;
	this.updateQuizHint();
};

User.prototype.updateQuizHint = function() {
	if(this.isClassQuizDone())
		$('.hint-quiz').hide();
	else
		$('.hint-quiz').show();
};

User.prototype.isClassQuizDone = function() {
	if(Number.parseInt(this.user.rank_id) === -1)
		return false;

	return true;
};