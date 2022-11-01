/*
Template Name: HUD - Responsive Bootstrap 5 Admin Template
Version: 1.6.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud/
*/

var handleFilter = function() {
	"use strict";
	
	jQuery(document).on('click', '.pos-menu [data-filter]', function(e) {
		e.preventDefault();
		
		var targetType = jQuery(this).attr('data-filter');
		
		jQuery(this).addClass('active');
		jQuery('.pos-menu [data-filter]').not(this).removeClass('active');
		if (targetType == 'all') {
			jQuery('.pos-content [data-type]').removeClass('d-none');
		} else {
			jQuery('.pos-content [data-type="'+ targetType +'"]').removeClass('d-none');
			jQuery('.pos-content [data-type]').not('.pos-content [data-type="'+ targetType +'"]').addClass('d-none');
		}
	});
};

document.addEventListener('DOMContentLoaded', function() {
	handleFilter();
});