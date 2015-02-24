var	BaseRequestUrl = 'http://www.rhoenkaff.de/cocina/api/v1',

	UserStatus = {
		GUEST: 0,
		ADMIN: 1,
		USER: 2
	},

	StatusCodes = {
		ACCOUNT_CREATED_SUCCESSFULLY: 0,
		ACCOUNT_CREATE_FAILED: 1,
		ACCOUNT_USERNAME_ALREADY_EXISTED: 2,
		ACCOUNT_EMAIL_ALREADY_EXISTED: 3,
		ACCOUNT_NOT_UNIQUE: 4,
		ACCOUNT_CHECKED_SUCCESSFULLY: 5
	},

	QuizTypes = {
		MULTIPLY_CHOICE : 'mc',
		SINGLE_CHOICE : 'sc'
	};
