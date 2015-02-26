var RecipeController = function (recipeId, user) {
	this.TAG = 'RecipeHandler => ';

	this.id = recipeId;
	this.template = 'recipe_detail.html';
	this.keywordFile = 'ingredients.json';
	this.moodleBaseUrl = "https://wuecampus2.uni-wuerzburg.de/moodle/mod/quiz/view.php?id="
	this.keywords = '';
	this.recipe = null;
	this.user = user;
}

RecipeController.prototype.init = function(callback) {
	var self = this;

	this.loadTemplate(function (event) {
		self.loadRecipe(function (event) {
			if(typeof(callback) === 'function' && callback !== undefined)
				callback('recipe-initialized');
		});
	});
};

RecipeController.prototype.loadTemplate = function(callback) {
	$('#recipeDetail .ui-content').load('content/' + this.template, function () {
		$('#recipeDetail .ui-content').enhanceWithin();

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('template-loaded');
	});
};

RecipeController.prototype.loadRecipe = function(callback) {
	var self = this;

	if(this.id == null) // DEBUGGING CONTENT -> REMOVE LATER!!! :)
		this.id = 2;

	$.getJSON('content/recipe_' + this.id + '.json', function (recipe) {
		self.recipe = recipe;

		if(typeof(callback) === 'function' && callback !== undefined)
			callback('recipe-received');
	});
};

RecipeController.prototype.loadKeywordList = function(callback) {
	$.getJSON('content/' + this.keywordFile, function (keywords) {
		if(typeof(callback) === 'function' && callback !== undefined)
			callback('keywords-received', keywords);
	});
};

RecipeController.prototype.parse = function() {
	var self = this,
		recipe = this.recipe;

	$('#recipe-title').text(recipe.title);
	$('#recipe-level').text(recipe.level);
	$('#recipe-time').text(recipe.time);
	$('#recipe-kind').text(recipe.kind);
	$('#recipe-feature').text(recipe.feature);

	this.loadMainPicture(recipe.images, recipe.id);
	this.buildIngredients(recipe.ingredients);
	this.buildAnimations(recipe.animations);
	this.buildPreperations(recipe.preperation);
	this.buildRecipeQuiz(recipe.quiz_id);
	this.setFeedbackVisiblity();
	this.bindEvents();

	this.loadKeywordList(function (event, result) {
		self.keywords = result;
		self.highlightKeywords();
	});
};

RecipeController.prototype.loadMainPicture = function(images, recipeId) {
	var imgPath = 'img/recipes/' + recipeId + '/',
		imgDom = $('.recipe-image');

	if(images.length === 0)
		imgPath += 'default.jpg';
	else
		imgPath += images[0];

	imgDom.html('<img src="' + imgPath + '"" class="preview-img" />');
};

RecipeController.prototype.buildIngredients = function(ingredients) {
	$('.recipe-ingredients table > tbody').remove(); // clear ingredients table

	var ingrTable = '';
	ingredients.forEach(function (ingred, index) {
		var splitIngr = ingred.split('|');
		ingrTable += '<tr><td>' + splitIngr[0] + '</td><td>' + splitIngr[1] + '</td></tr>';
	});

	$('.recipe-ingredients table').append(ingrTable);
};

RecipeController.prototype.buildAnimations = function(animations) {
	if(animations === undefined || animations.length === 0)
		return;

	var animationContainer = $('.recipe-animation');
	animations.forEach(function (item, index) {
		$( animationContainer )
			.append('<a href="#" data-role="button" class="open-animation-btn coc-btn" id="' + index + '">' + item.title + '</a>')
			.enhanceWithin();
	});
};

RecipeController.prototype.buildPreperations = function(preperation) {
	var instruction = '';

	preperation.forEach(function (step, index) {
		instruction += '<li>' + step + '</li>';
	});

	$('.recipe-preperation > ol').append(instruction);
};

RecipeController.prototype.buildRecipeQuiz = function(quizId) {
	var quizUrl = this.moodleBaseUrl + quizId;

	$('.recipe-quiz')
		.append('<a data-role="button" class="coc-btn">Moodle Quiz starten</a>')
		.enhanceWithin();
	$('.recipe-quiz').find('a:first').on('click', function () {
		window.open(quizUrl, '_system');
	});
};

RecipeController.prototype.setFeedbackVisiblity = function() {
	var overlayer = $('.feedback > .wrapper > .overlayer');

	if(this.user.isLoggedIn())
		overlayer.hide();
	else
		overlayer.show();
};

RecipeController.prototype.bindEvents = function() {
	var self = this;

	$('#feedback-submit-btn').on('click', function (event) {
		event.preventDefault();
		$(this).addClass('ui-disabled');
		$('#feedbackPopup').popup('open');
	});

	$('.open-animation-btn').on('click', function (event) {
		$.mobile.loading('show');
		event.preventDefault();

		var animationPopup = new AnimationController(self.recipe, event.target.id);
		animationPopup.buildPopup();
	});
};

RecipeController.prototype.highlightKeywords = function() {
	var keywordArray = [],
		self = this;

	this.keywords.forEach(function (keyword, index) {
		keywordArray.push(keyword.name);
	});

	$('.tbl-ingredients').highlight(keywordArray, { element : 'a', className : 'ingr-highlight ui-link', target : '#detailPopup' });
	$('.ingr-highlight').on('click', function (event, data) {
		var ingredientName = event.target.text,
			ingredient = $.grep(self.keywords, function (item) { return item.name === ingredientName });
			ingredientContr = new IngredientController(ingredient[0]);

		ingredientContr.parse();
		$('#detailPopup').popup('open', { positionTo : 'window'});
	});
};