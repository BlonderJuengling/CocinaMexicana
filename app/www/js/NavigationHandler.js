var NavigationHandler = function () {
	this.TAG = 'NavHandler => ';

	this.navpanel = $('#navpanel');
	this.navImgContainer = $('.nav-image-container');
	this.navMenuImg = $(this.navImgContainer).find('img').eq(0);
	this.navBackImg = $(this.navImgContainer).find('img').eq(1);
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

NavigationHandler.prototype.observePageShowEvent = function() {
	var self = this;

	$(document).on('pageshow', function (event, ui) {
		var pageHistory = $.mobile.navigate.history,
			duration = 'fast',
			easing = 'linear';

		if(pageHistory.activeIndex === -1) {
			$(self.navBackImg).hide(duration, easing, function () {
				$(self.navMenuImg).show(duration, easing);
			});
		}
		else {
			$(self.navMenuImg).hide(duration, easing, function () {
				$(self.navBackImg).show(duration, easing);
			});
		}
	});
};

NavigationHandler.prototype.setNavpanelOnClickListener = function() {
	var self = this;

	$('#home').on('pageshow', function () {
		var history = $.mobile.navigate.history;
		while(history.stack.length > 0)
			history.stack.pop();

		history.activeIndex = -1;
	});
};