/*
Template Name: HUD - Responsive Bootstrap 5 Admin Template
Version: 1.6.0
Author: Sean Ngu
Website: http://www.seantheme.com/hud/
*/

var handleRenderGallery = function() {
	var gallerySelector = '.gallery-image-list';
	var parseThumbnailElements = function(el) {
		var thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			figureEl,
			linkEl,
			size,
			item;
			
		for(var i = 0; i < numNodes; i++) {
			figureEl = thumbElements[i];
			if(figureEl.nodeType !== 1) {
				continue;
			}
			linkEl = figureEl.children[0];
			size = linkEl.getAttribute('data-size').split('x');
			item = {
				src: linkEl.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
			if(figureEl.children.length > 1) {
				item.title = figureEl.children[1].innerHTML; 
			}
			if(linkEl.children.length > 0) {
				item.msrc = linkEl.children[0].getAttribute('src');
			}
			item.el = figureEl;
			items.push(item);
		}
		return items;
	};

	var closest = function closest(el, fn) {
		return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};

	var onThumbnailsClick = function(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}

		var eTarget = e.target || e.srcElement;
		var clickedListItem = closest(eTarget, function(el) {
			return (el.tagName && el.tagName.toUpperCase() === 'LI');
		});

		if(!clickedListItem) {
			return;
		}
		
		var clickedGallery = clickedListItem.parentNode,
			childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;

		for (var i = 0; i < numChildNodes; i++) {
			if(childNodes[i].nodeType !== 1) { 
				continue; 
			}
			if(childNodes[i] === clickedListItem) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}
		if(index >= 0) {
			openPhotoSwipe( index, clickedGallery );
		}
		return false;
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};
		if(hash.length < 5) {
			return params;
		}
		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}
		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}
		return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		// define options (if needed)
		options = {

			// define gallery index (for URL)
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function(index) {
				// See Options -> getThumbBoundsFn section of documentation for more info
				var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect(); 

				return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
			}

		};

		// PhotoSwipe opened from URL
		if(fromURL) {
			if(options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for(var j = 0; j < items.length; j++) {
					if(items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if( isNaN(options.index) ) {
			return;
		}

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

	var galleryElements = document.querySelectorAll(gallerySelector);
	
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	var hashData = photoswipeParseHash();
	if(hashData.pid && hashData.gid) {
		openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
	}
};


/* Controller
------------------------------------------------ */
jQuery(document).ready(function() {
	handleRenderGallery();
});