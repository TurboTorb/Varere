/*
Template Name: HUD - Responsive Bootstrap 5 Admin Template
Version: 1.6.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud/
*/

var handleRenderSummernote = function() {
	var totalHeight = (jQuery(window).width() >= 767) ? jQuery(window).height() - jQuery('.summernote').offset().top - 90 : 400;
	jQuery('.summernote').summernote({
		height: totalHeight
	});
};

var handleEmailTagsInput = function() {
	jQuery('#email-to').tagit({
		availableTags: ["admin2@seantheme.com", "admin3@seantheme.com", "admin4@seantheme.com", "admin5@seantheme.com", "admin6@seantheme.com", "admin7@seantheme.com", "admin8@seantheme.com"]
	});
	jQuery('#email-cc').tagit({
		availableTags: ["admin2@seantheme.com", "admin3@seantheme.com", "admin4@seantheme.com", "admin5@seantheme.com", "admin6@seantheme.com", "admin7@seantheme.com", "admin8@seantheme.com"]
	});
	jQuery('#email-bcc').tagit({
		availableTags: ["admin2@seantheme.com", "admin3@seantheme.com", "admin4@seantheme.com", "admin5@seantheme.com", "admin6@seantheme.com", "admin7@seantheme.com", "admin8@seantheme.com"]
	});
};


/* Controller
------------------------------------------------ */
jQuery(document).ready(function() {
	handleRenderSummernote();
	handleEmailTagsInput();
});