var IngredientController = function (ingredientData) {
	this.TAG = 'IngredientController => ';

	this.template = 'ingredient_detail.html';
	this.contentBox = $('.ingredient-box');
	this.ingredient = ingredientData;
};

IngredientController.prototype.parse = function(callback) {
	var self = this,
		data = this.ingredient;

	this.loadTemplate(function (event) {
		self.setTitle(data.name);
		self.setIntroduction(data.introduction);
		self.setImage(data.image);
		self.setSections(data.sections);
		self.setKnowledgeDbBtn(2);
		$(self.contentBox).enhanceWithin();

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('ingredient-content-finished');
	});
};

IngredientController.prototype.loadTemplate = function(callback) {
	$(this.contentBox).load('content/' + this.template, function () {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

IngredientController.prototype.setTitle = function(title) {
	$(this.contentBox).find('h1:first').text(title);
};

IngredientController.prototype.setIntroduction = function(introduction) {
	$(this.contentBox).find('.introduction>.content').html(introduction);
};

IngredientController.prototype.setImage = function(img) {
	$(this.contentBox).find('img').attr('src', 'img/knowledge/' + img);
};

IngredientController.prototype.setSections = function(sections) {
	var sectionsContainer = $('.ingredient-box #sections'),
		sectionTemplate = $(sectionsContainer).find('.section:first');

	if(sections === undefined || sections.length === 0) {
		$(sectionsContainer).empty().append('<i>keine weiteren Informationen vorhanden</i>');
		console.log(this.TAG + 'no sections defined; nothing to do');
		return;
	}

	$(sectionsContainer).empty(); // clear template

	sections.forEach(function (item, index) {
		var clone = $(sectionTemplate).clone();

		$(clone).children().eq(0).text(item.heading);
		$(clone).children().eq(1).html(item.content);

		$('.ingredient-box #sections').append(clone);
	});
};

IngredientController.prototype.setKnowledgeDbBtn = function(id) {
	$(this.contentBox).find('#goto-knowledge-btn').on('click', function (event) {
		app.passDataObject.selectedKnowledgeId = id;
	});
};