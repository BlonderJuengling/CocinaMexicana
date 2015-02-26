var AnimationController = function (popupContent, animationIndex) {
	this.TAG = 'AnimationController => ';

	this.data = popupContent;
	this.animationIndex = animationIndex;

	this.popup = {
		closebtn : '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
		header : '<div data-role="header" style="padding: 0.5em">' + this.data.animations[this.animationIndex].title + '</div>',
		content : this.buildPopupContent(),
		popup : '<div data-role="popup" id="popup-animation" data-theme="none" data-overlay-theme="b" data-corners="false" data-tolerance="15"></div>'
	};
}

AnimationController.prototype.buildPopupContent = function() {
	var self = this,
		content ='<div class="animation-slider-wrapper"><ul class="animation-slider">',
		steps = this.data.animations[this.animationIndex].steps;

	steps.forEach(function (item, index) {
		content += 	'<li><img src="img/recipes/' + self.data.id + '/' + item.image +'"' +
					'title="' + (index +1) +'. Schritt: ' + item.caption + '" class="photo"/></li>'
	});

	content +='</ul></div>';

	return content;
};

AnimationController.prototype.buildPopup = function() {
	var self = this;

	$( this.popup.header )
		.appendTo( $( this.popup.popup )
			.appendTo( $.mobile.activePage )
			.popup() )
		.toolbar()
		.before( this.popup.closebtn )
		.after( this.popup.content );

	$('.animation-slider').bxSlider({
		mode: 'fade',
		captions: true,
		auto: true,
		autoControls: true,
		pause: 5000,
		onSliderLoad: function() {
			$.mobile.loading('hide');
			$('#popup-animation').popup('reposition', { positionTo: 'origin' });
			$('#popup-animation').popup('open');
		}
	});

	$(document).on('popupbeforeposition', '.ui-popup', function () {
        var image = $( this ).children( 'img' ),
            height = image.height(),
            width = image.width();
        // Set height and width attribute of the image
        $( this ).attr({ "height": height, "width": width });
        // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
        var maxHeight = $( window ).height() - 150 + "px";
        $( "img.photo", this ).css( "max-height", maxHeight );
    });

	$(document).on('popupafterclose', '#popup-animation', function ()  {
		$(this).remove();
	});
};
