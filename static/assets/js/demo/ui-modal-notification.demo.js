/*
Template Name: HUD - Responsive Bootstrap 5 Admin Template
Version: 1.6.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud/
*/

var handleToastsInit = function() {
	jQuery('[data-init="toast"]').toast('show');
};

var handleToastToggle = function() {
	jQuery(document).on('click', '[data-toggle="toast"]', function(e) {
		e.preventDefault();
		
		var targetElm = jQuery(this).attr('data-target');
		jQuery(targetElm).toast('show');
	});
};


/* Controller
------------------------------------------------ */
jQuery(document).ready(function() {
	handleToastsInit();
	handleToastToggle();
});