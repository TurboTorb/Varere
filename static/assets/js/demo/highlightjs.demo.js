/*
Template Name: HUD - Responsive Bootstrap 5 Admin Template
Version: 1.6.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud/
*/

var handleInitHighlightJs = function() {
	jQuery('.hljs-container pre code').each(function(i, block) {
		hljs.highlightElement(block);
	});
};


/* Controller
------------------------------------------------ */
jQuery(document).ready(function() {
	handleInitHighlightJs();
});