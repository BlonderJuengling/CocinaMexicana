var PopupController = function (content) {
	this.TAG = 'PopupController => ';

	this.content = content;

	this.popup = {
		closebtn : '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
		header : '<div data-role="header"><h3>{ Test-Header }</h3></div>',
		content : this.buildPopupContent(),
		popup : '<div data-role="popup" id="popup-cocina" data-theme="none" data-overlay-theme="b" data-corners="false" data-tolerance="15"></div>'
	};
}

PopupController.prototype.buildPopupContent = function() {
	var self = this,
		content ='<div class="popup-content-wrapper">{ inhalt }</div>';

	return content;
};

PopupController.prototype.buildPopup = function() {
	var self = this;

	$( this.popup.header )
		.appendTo( $( this.popup.popup )
			.appendTo( $.mobile.activePage )
			.popup() )
		.toolbar()
		.before( this.popup.closebtn )
		.after( this.popup.content );



	$(document).on('popupafterclose', '#popup-animation', function ()  {
		$(this).remove();
	});
};
