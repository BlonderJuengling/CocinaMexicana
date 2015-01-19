var RegistrationHandler = function () {
	this.TAG = 'RegHandler => ';

	this.user = {};
	this.errors = [];
}

RegistrationHandler.prototype.register = function () {
	this.user = this.getValuesFromForm();
	this.clearErrorLabels();

	if(!this.isValid()) {
		this.showError();
		return;
	}

	var self = this,
		request = $.ajax({
			type: 'POST',
			url: 'http://localhost/cocina/api/v1/account',
			data: this.user,
		});

	request.done(function (response) {
		if(response.error) {
			self.addRemoteErrorInfos(response.error_codes);
			self.showError();
			return;
		}

		$('#registerPopupSuccess').popup('open', { positionTo : 'window' });
		self.clearForm();
	});

	request.fail(function (jqXHR, status) {
		console.log(self.TAG + 'Error | Status: ' + status + '; jqXHR: ' + JSON.stringify(jqXHR));
	});
};

RegistrationHandler.prototype.getValuesFromForm = function () {
	return {
		'username' : $('#register-form #username').val(),
		'email' : $('#register-form #email').val(),
		'password' : $('#register-form #password').val(),
		'passwordRep' : $('#register-form #password-repeat').val(),
		'firstname' : $('#register-form #firstname').val(),
		'lastname' : $('#register-form #lastname').val(),
	}
};

RegistrationHandler.prototype.clearErrorLabels = function() {
	$('#register-form .form-error').text('');
};

RegistrationHandler.prototype.clearForm = function() {
	$('#register-form').trigger('reset');
};

RegistrationHandler.prototype.isValid = function() {
	if(this.user.username === '')
		this.errors.push({ 'field' : 'username', 'msg' : 'Username darf nicht leer sein' });
	if(this.user.email === '')
		this.errors.push({ 'field' : 'email', 'msg' : 'E-Mail darf nicht leer sein' });
	if(this.user.password == '')
		this.errors.push({ 'field' : 'password', 'msg' : 'Passwort darf nicht leer sein' });
	if(this.user.passwordRep === '')
		this.errors.push({ 'field' : 'passwordRep', 'msg' : 'Passwort bitte wiederholen' });
	if(this.user.passwordRep !== this.user.password)
		this.errors.push({ 'field' : 'passwordRep', 'msg' : 'Eingegebenen Passwörter stimmen nicht überein' });
	if(this.user.firstname === '')
		this.errors.push({ 'field' : 'firstname', 'msg' : 'Vorname darf nicht leer sein' });
	if(this.user.lastname === '')
		this.errors.push({ 'field' : 'lastname', 'msg' : 'Nachname darf nicht leer sein' });

	if(this.errors.length > 0)
		return false;

	return true;
};

RegistrationHandler.prototype.showError = function() {
	for(var item in this.errors) {
		var error = this.errors[item];
		$('#error-' + error.field).text(error.msg);
	}
};

RegistrationHandler.prototype.addRemoteErrorInfos = function(errorCodes) {
	if(errorCodes.hasOwnProperty(StatusCodes.ACCOUNT_USERNAME_ALREADY_EXISTED))
		this.errors.push({ 'field' : 'username', 'msg' : 'Username wird bereits verwendet' });
	if(errorCodes.hasOwnProperty(StatusCodes.ACCOUNT_EMAIL_ALREADY_EXISTED))
		this.errors.push({ 'field' : 'email', 'msg' : 'E-Mail Adresse wird bereits verwendet' });
};