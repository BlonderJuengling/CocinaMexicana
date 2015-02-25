var Userpanel = function () {
	this.TAG = 'Userpanel => ';
	this.user = null;
	this.template = 'userpanel.html';
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

	var self = this;
	$('#userpanel .ui-content').load('content/' + this.template, function () {
		$('#ranking-tbl-wrapper').hide();

		self.renderUserInformation($(this));
		self.requestRankInformation();
		self.setEventHandler();

		if(!self.user.isClassQuizDone()) {
			$('#userpanel .hint-quiz').show();
		}



		$(this).enhanceWithin();
	});
};

Userpanel.prototype.renderUserInformation = function(uiContainer) {
	var user = this.user.getCurrentUser();

	$(uiContainer).find('#user-username').text(user.username);
	$(uiContainer).find('#user-firstname').text(user.firstname);
	$(uiContainer).find('#user-lastname').text(user.lastname);
	$(uiContainer).find('#user-email').text(user.email);
	// do fancy stuff here ;D
};

Userpanel.prototype.requestRankInformation = function() {
	var self = this,
		request = $.ajax({
			url: BaseRequestUrl + '/ranks',
			type: 'GET',
			dataType: 'json'
		});

	request.done(function (response) {
		if(response.error) {
			alert(response.message);
			return;
		}

		var ranks = response.ranks;
		self.setUserCurrentRank(ranks);
		self.buildDetailedRankInfo(ranks);
	});

	request.fail(function (jqXHR, status) {
		console.log(self.TAG + 'Error | Status: ' + status + '; jqXHR: ' + JSON.stringify(jqXHR));
	});
};

Userpanel.prototype.setUserCurrentRank = function(availableRanks) {
	var rankSelector = $('#userpanel .ui-content').find('#user-rank');

	if(!this.user.isClassQuizDone()) {
		$(rankSelector).text('"noch nicht eingestuft"');
		return;
	}

	var self = this,
		userRank = $.grep(availableRanks, function (rank) { return rank.id === self.user.getCurrentRankId(); })[0];
	$(rankSelector).text(userRank.rank + ' (' + userRank.category + ')');
};

Userpanel.prototype.setEventHandler = function() {
	$('#show-complete-ranking-btn').on('click', function() {
		var uiContainer = $('#ranking-tbl-wrapper');
		$(uiContainer).toggle();

		if($(uiContainer).is(':visible'))
			$(this).text('Rangsystem ausblenden');
		else
			$(this).text('Rangsystem einblenden');
	});
	$('#cert-dl-btn').on('click', function (event) {
		event.preventDefault();
		alert('Kommt noch ...');
	});
	$('#logout-btn').on('click', function (event) {
		event.preventDefault();
		app.loginHandler.logout();
		$.mobile.changePage('');
	});
};

Userpanel.prototype.buildDetailedRankInfo = function(availableRanks) {
	var rankTableBody = $('#ranking-tbl').find('tbody');
	availableRanks.forEach(function (item, index) {
		var tblRow =
			'<tr>' +
			'<td>' + item.rank + '</td>' +
			'<td>' + item.category + '</td>' +
			'<td>' + item.promotion_criterions + ' Rezepte</td>' +
			'</tr>';
		$(rankTableBody).append(tblRow);
	});
};