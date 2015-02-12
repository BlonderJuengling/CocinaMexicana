var Quiz = function (fileName) {
	this.TAG = 'Quiz => ';

	this.file = fileName;
	this.quiz = {};
	this.page = null;
	this.builder = new QuizBuilder();
	this.validator = new QuizValidator();
}

Quiz.prototype.load = function(callback) {
	var self = this;

	$.getJSON('content/' + this.file, function (quizData) {
		console.log(self.TAG + 'load quiz data finished');

		self.quiz = quizData;

		if(typeof(callback) == 'function' && callback != null) {
			self.builder.build(quizData);
			//self.validator.setSolution(self.extractSolution(quizData.questions));
			self.validator.setQuiz(quizData);
			self.page = self.builder.getQuizPage();

			callback('finished');
		}
	});
};

Quiz.prototype.extractSolution = function(questions) {
	var solutions = [];

	questions.forEach(function (item, index) {
		solutions.push({
			'correct_answer' : item.correct_answer,
			'explanation' : item.explanation
		});
	});

	return solutions;
};

Quiz.prototype.show = function() {
	$('#classQuiz .quiz-content').append(this.page).enhanceWithin();

	this.bindEvents();
};

Quiz.prototype.bindEvents = function() {
	var self = this;

	$('#submitQuiz').on('click', function(event) {
		event.preventDefault();
		self.validator.validate();
	});
};