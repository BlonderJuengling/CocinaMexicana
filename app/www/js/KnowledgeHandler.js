var KnowledgeHandler = function (container) {
	this.TAG = 'KnowledgeHandler => ';

	this.container = container;
	this.setClickHandler();
}

KnowledgeHandler.prototype.setClickHandler = function() {
	console.log(this.TAG + 'set listener');

	var self = this;

	$(this.container).find('.btn-toggle:visible').on('click', function (event) {
		event.preventDefault();
		console.log(event.target.name);

		$('.knowledge-article-chapter > .knowledge-content').eq(event.target.name -1).toggle();
	});
};