var User = function () {
	this.TAG = 'User => ';
	this.user = null;

	this.load();
}

User.prototype.load = function () {
	if(window.localStorage != null) {
		var userInStore = JSON.parse(window.localStorage.getItem('session'));

		if(userInStore !== null) {
			this.setCurrentUser(userInStore);

			console.log(this.TAG + 'successfully restored user session');
		}
		else
			console.log(this.TAG + 'no user session exist in localStorage');
	}
}

User.prototype.store = function() {
	if(window.localStorage != null && this.user != null) {
		window.localStorage.setItem('session', JSON.stringify(this.user));
		console.log(this.TAG + 'store user changes in localStorage');
	}
};

User.prototype.getCurrentUser = function () {
	return this.user;
};

User.prototype.setCurrentUser = function (user) {
	this.user = user;
};

User.prototype.clearCurrentUser = function () {
	this.user = null;
	this.clearQuizHint();
};

User.prototype.getUserStatus = function () {
	if(this.user == null)
		return UserStatus.GUEST;

	return this.user.status;
};

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
	this.store();
};

User.prototype.updateQuizHint = function() {
	if(this.isClassQuizDone())
		$('.hint-quiz').hide();
	else
		$('.hint-quiz').show();
};

User.prototype.clearQuizHint = function() {
	$('.hint-quiz').hide();
};

User.prototype.isClassQuizDone = function() {
	if(parseInt(this.user.rank_id) === -1)
		return false;

	return true;
};