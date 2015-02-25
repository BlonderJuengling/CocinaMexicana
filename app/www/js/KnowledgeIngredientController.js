var KnowledgeIngredientController = function (ingredientData) {
	this.TAG = 'KnowledgeIngredientController => ';

	this.template = 'knowledge_ingredient_detail.html';
	this.popupDom = $('#detailPopup');
	this.ingredient = ingredientData;

	console.log(this.ingredient);
}

KnowledgeIngredientController.prototype.parse = function() {
	var self = this,
		data = this.ingredient;

	this.loadTemplate(function (event) {
		console.log(self.TAG + event);

		$(this.popupDom).enhanceWithin();
		self.setTitle(data.name);
		self.setImages(data.images);
		self.setIntroduction(data.introduction);
		self.setSections(data.sections);
		self.setQuizBtn(data.quiz_url);

		$(self.popupDom).popup('reposition', { positionTo : 'window' });
	});
};

KnowledgeIngredientController.prototype.loadTemplate = function(callback) {
	$('#detailPopup .ui-content').load('content/' + this.template, function () {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

KnowledgeIngredientController.prototype.setTitle = function(title) {
	console.log(title);
	$(this.popupDom).find('h1:first').html(title);
};

KnowledgeIngredientController.prototype.setImages = function(images) {
	console.log(this.TAG + 'images loading here');
};

KnowledgeIngredientController.prototype.setIntroduction = function(introduction) {
	$(this.popupDom).find('.introduction>.content').html(introduction);
};

KnowledgeIngredientController.prototype.setSections = function(sections) {
	var sectionsContainer = $('#detailPopup #sections'),
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

		$('#detailPopup #sections').append(clone);
	});
};

KnowledgeIngredientController.prototype.setQuizBtn = function(quiz_url) {
	$(this.popupDom).find('#start-quiz-btn').on('click', function (event) {
		event.preventDefault();
		console.log('hier dann neues fenster öffnen bitte');
	});
};