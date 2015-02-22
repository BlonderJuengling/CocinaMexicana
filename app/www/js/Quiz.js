var Quiz = function (fileName, currentUser) {
	this.TAG = 'Quiz => ';

	this.file = fileName;
	this.currentUser = currentUser;
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

		if(typeof(callback) === 'function' && callback !== undefined) {
			self.builder.build(quizData);
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
		self.validator.validate(function (quizResult) {
			if(quizResult !== null) {
				self.storeQuizResult(quizResult);
				$.mobile.changePage('#resultQuiz');
			}
		});
	});
};

Quiz.prototype.storeQuizResult = function(result) {
	var self = this,
		request = $.ajax({
			url: BaseRequestUrl + '/quiz',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-Authorization', self.currentUser.getApiKey());
			},
			type: 'POST',
			data: {
				'userid' : self.currentUser.getUserId(),
				'score' : JSON.stringify(result)
			},
			dataType: 'json'
		});

	request.done(function (response) {
		if(response.error) {
			console.log(response.message);
			return;
		}

		$('#resultQuiz .quiz-content #classRank').text(response.current_rank);
		self.currentUser.setCurrentRank(response.rank_id);
	});

	request.fail(function (jqXHR, status) {
		console.log(self.TAG + 'Error | Status: ' + status + '; jqXHR: ' + JSON.stringify(jqXHR));
	});

};