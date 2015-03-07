var KnowledgeIngredientController = function (ingredientData) {
	this.TAG = 'KnowledgeIngredientController => ';

	this.template = 'knowledge_ingredient_detail.html';
	this.ingredientHeader = $('#knowledgeDatabase').find('.ingredient-list-wrapper');
	this.ingredientDetails = $('#knowledgeDatabase').find('.ingredient-detail-wrapper');
	this.ingredient = ingredientData;
};

KnowledgeIngredientController.prototype.parse = function(callback) {
	var self = this,
		data = this.ingredient;

	this.loadTemplate(function (event) {
		self.setTitle(data.name);
		self.setIntroduction(data.introduction);
		self.setImage(data.image);
		self.setSections(data.sections);
		self.setQuizBtn(data.quiz_url);

		self.ingredientDetails.enhanceWithin();

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('popup-content-finished');
	});
};

KnowledgeIngredientController.prototype.loadTemplate = function(callback) {
	$(this.ingredientDetails).load('content/' + this.template, function () {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

KnowledgeIngredientController.prototype.setTitle = function(title) {
	$(this.ingredientDetails).find('h1:first').html(title);
};

KnowledgeIngredientController.prototype.setIntroduction = function(introduction) {
	$(this.ingredientDetails).find('.introduction>.content').html(introduction);
};

KnowledgeIngredientController.prototype.setImage = function(img) {
	$(this.ingredientDetails).find('img').attr('src', 'img/knowledge/' + img);
};

KnowledgeIngredientController.prototype.setSections = function(sections) {
	var sectionsContainer = $('.ingredient-detail-wrapper #sections'),
		sectionTemplate = $(sectionsContainer).find('.section:first');

	if(sections === undefined || sections.length === 0) {
		$(sectionsContainer).empty().append('<i>keine weiteren Informationen vorhanden</i>');
		console.log(this.TAG + 'no sections defined; nothing to do');
		return;
	}

	$(sectionsContainer).empty(); // clear template

	sections.forEach(function (item, index) {
		var clone = $(sectionTemplate).clone();

		$(clone).children().eq(0).html(item.heading);
		$(clone).children().eq(1).html(item.content);

		$('.ingredient-detail-wrapper #sections').append(clone);
	});
};

KnowledgeIngredientController.prototype.setQuizBtn = function(quiz_url) {
	$(this.ingredientDetails).find('#start-quiz-btn').on('click', function (event) {
		event.preventDefault();
	});
};