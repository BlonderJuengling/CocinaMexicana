var IngredientController = function (ingredientData) {
	this.TAG = 'IngredientController => ';

	this.template = 'ingredient_detail.html';
	this.popupDom = $('#detailPopup');
	this.ingredient = ingredientData;
}

IngredientController.prototype.parse = function(callback) {
	var self = this,
		data = this.ingredient;

	this.loadTemplate(function (event) {
		self.setTitle(data.name);
		self.setIntroduction(data.introduction);
		self.setSections(data.sections);
		self.setKnowledgeDbBtn(2);
		$(self.popupDom).enhanceWithin();

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('popup-content-finished');
	});
};

IngredientController.prototype.loadTemplate = function(callback) {
	$('#detailPopup .ui-content').load('content/' + this.template, function () {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

IngredientController.prototype.setTitle = function(title) {
	console.log(title);
	$(this.popupDom).find('h1:first').text(title);
};

IngredientController.prototype.setIntroduction = function(introduction) {
	$(this.popupDom).find('.introduction>.content').html(introduction);
};

IngredientController.prototype.setSections = function(sections) {
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

		$(clone).children().eq(0).text(item.heading);
		$(clone).children().eq(1).html(item.content);

		$('#detailPopup #sections').append(clone);
	});
};

IngredientController.prototype.setKnowledgeDbBtn = function(id) {
	$(this.popupDom).find('#goto-knowledge-btn').on('click', function (event) {
		app.passDataObject.selectedKnowledgeId = id;
	});
};