var QuizValidator = function () {
	this.TAG = 'QuizValidator => ';

	this.quiz = null;
	this.evaluation = null;
	this.result = null;
	this.resultPage = '';
}

QuizValidator.prototype.setQuiz = function(quiz) {
	this.quiz = quiz;
};

QuizValidator.prototype.validate = function(callback) {
	var userSolution = this.getUserSolution(),
		quizQuestions = this.quiz.questions;

	if(userSolution.length < quizQuestions.length) {
		this.showError('no-selection');

		if(typeof(callback) === 'function' && callback !== undefined){
			callback(null);
			return;
		}
	}

	this.evaluation = this.getEvaluation(userSolution, quizQuestions);
	this.result = this.getResult(this.evaluation);

	this.buildResultPage(this.evaluation);
	this.showResult();

	if(typeof(callback) === 'function' && callback !== undefined) {
		callback(this.result);
	}
};

QuizValidator.prototype.getEvaluation = function(userSolution, quizQuestions) {
	var eval = []

	for(var i = 0; i < userSolution.length; i++) {
		eval.push({
			'is_correct' : this.isAnswerCorrect(userSolution[i], quizQuestions[i].correct_answer),
			'answer_index' : userSolution[i] -1 });
	}

	return eval;
};

QuizValidator.prototype.getResult = function(evaluation) {
	return {
		'questions' : this.evaluation.length,
		'correct_answers' : this.getNumberOfCorrectAnswers()
	};
};

QuizValidator.prototype.getNumberOfCorrectAnswers = function() {
	var count = 0;

	this.evaluation.forEach(function (item, index) {
		if(item.is_correct === true)
			count++;
	});

	return count;
};

QuizValidator.prototype.showError = function(errorType) {
	switch (errorType) {
		case 'no-selection':
			$('#errorPopup .ui-content').children().remove(':not(a)'); // clear popup content first
			$('#errorPopup .ui-content a').before('<h3>Bitte fülle das Quiz-Formular vollständig aus!</h3>');
			$('#errorPopup').popup('open', { positionTo : 'window' });
			break;
		default:
	}
};

QuizValidator.prototype.isAnswerCorrect = function(userAnswer, correctAnswer) {
	if(userAnswer === correctAnswer)
		return true;

	return false;
};

QuizValidator.prototype.getUserSolution = function() {
	var userSolution = [];
	var selectedItems = $('form:visible :checked');

	for (var i = 0; i < selectedItems.length; i++) {
		var questionSolution = $(selectedItems[i]).val();
		userSolution.push(Number.parseInt(questionSolution));
	};

	return userSolution;
};

QuizValidator.prototype.showResult = function() {
	$('#resultQuiz .quiz-content').append(this.resultPage).enhanceWithin();
	this.bindEvents();
};

QuizValidator.prototype.bindEvents = function(first_argument) {
	var self = this;

	$('#btn-to-userpanel').on('click', function (event) {
		event.preventDefault();
		$.mobile.changePage('#userpanel');
	});
};

QuizValidator.prototype.buildResultPage = function(quizResult) {
	var correctAnswers = this.getNumberOfCorrectAnswers(quizResult);

	this.resultPage = '<h2 class="quiz-result-heading">Du hast ' + correctAnswers + ' von ' + quizResult.length + ' Fragen richtig beantwortet</h2>';
	this.resultPage +=
		'<h3>Du erhälst den Einstiegsrang "<span id="classRank"></span>"!</h3>' +
		this.appendQuestionsAndAnswers(quizResult) +
		'<br />' +
		'<button type="submit" class="ui-shadow ui-btn ui-corner-all" data-theme="b" id="btn-to-userpanel">weiter zum Benutzerportal</button>';
};

QuizValidator.prototype.appendQuestionsAndAnswers = function(quizResult) {
	var self = this,
		html = '',
		questions = this.quiz.questions;

	questions.forEach(function (item, index) {
		var questionIndex = index +1,
			answerBoxClass = self.getAnswerClass(quizResult[index].is_correct);

		html += '<h4>' + questionIndex + '. ' + item.question + '</h4>';
		html += '<p><div class="quiz-answer ' + answerBoxClass + '">Deine Antwort: ' + item.answers[quizResult[index].answer_index] + '</div></p>';
		html += '<p><div class="quiz-answer">Richtige Antwort: ' + item.answers[item.correct_answer -1] + '</div></p>';
		html += '<p><div class="quiz-explanation"><b>Erklärung:</b><br />' + item.explanation + '</div></p>';
	});

	return html;
};

QuizValidator.prototype.getAnswerClass = function(boolValue) {
	if(boolValue === true)
		return 'quiz-correct';

	return 'quiz-wrong';
};