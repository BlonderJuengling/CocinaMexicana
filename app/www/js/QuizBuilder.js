var QuizBuilder = function () {
	this.TAG = 'QuizBuilder => ';

	this.quizPage = '';
	this.quizID = null;
}

QuizBuilder.prototype.build = function(quiz) {
	this.quizID = quiz.id;

	this.appendTitle(quiz.title);
	this.appendIntro(quiz.intro);

	this.buildQuestions(quiz.questions);
	this.appendSubmit();
};

QuizBuilder.prototype.getQuizPage = function() {
	return this.quizPage;
};

QuizBuilder.prototype.appendTitle = function(title) {
	this.quizPage += '<h2>' +  title + '</h2>';
};

QuizBuilder.prototype.appendIntro = function(intro) {
	this.quizPage += '<p>' + intro + '</p>';
};

QuizBuilder.prototype.buildQuestions = function(questions) {
	var self = this;

	questions.forEach(function (item, index) {
		self.appendQuestion(index +1, item.question);
		self.buildAnswerChoices(item.type, item.answers);
	});
};

QuizBuilder.prototype.appendQuestion = function(number, question) {
	this.quizPage += '<h3>' + number + '. ' + question + '</h1>';
};

QuizBuilder.prototype.buildAnswerChoices = function(type, answers) {
	this.quizPage += '<form>';

	switch(type) {
		case QuizTypes.MULTIPLY_CHOICE:
			this.appendMcAnswers(answers);
			break;
		case QuizTypes.SINGLE_CHOICE:
			this.appendScAnswers(answers);
			break;
		default:
			console.log(this.TAG + 'error: unknown question type');
	}

	this.quizPage += '</form>';
};

QuizBuilder.prototype.appendMcAnswers = function(answers) {
	var self = this;

	answers.forEach(function (item, index) {
		var answerNumber = Number.parseInt(index) + 1;
		self.quizPage += '<label><input type="checkbox" name="quiz_' + self.quizID + '" value="' + answerNumber + '" />' + item + '</label>';
	});
};

QuizBuilder.prototype.appendScAnswers = function(answers) {
	var self = this;

	answers.forEach(function (item, index) {
		var answerNumber = Number.parseInt(index) + 1;
		self.quizPage += '<label><input type="radio" name="quiz_' + self.quizID + '"  value="' + answerNumber + '" />' + item + '</label>';
	});
};

QuizBuilder.prototype.appendSubmit = function() {
	this.quizPage += '<p>&nbsp;</p><input type="button" id="submitQuiz" value="Abschicken">';
};