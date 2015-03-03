/*
 * Bones Scripts File
 * Author: Eddie Machado
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/


/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *	// update the viewport, in case the window size has changed
 *	viewport = updateViewportDimensions();
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function

 /**
* jquery.imgpreload 1.6.2 <https://github.com/farinspace/jquery.imgpreload>
* Copyright 2009-2014 Dimas Begunoff <http://farinspace.com>
* License MIT <http://opensource.org/licenses/MIT>
*/
"undefined"!=typeof jQuery&&!function(a){"use strict";a.imgpreload=function(b,c){c=a.extend({},a.fn.imgpreload.defaults,c instanceof Function?{all:c}:c),"string"==typeof b&&(b=[b]);var d=[];a.each(b,function(e,f){var g=new Image,h=f,i=g;"string"!=typeof f&&(h=a(f).attr("src")||a(f).css("background-image").replace(/^url\((?:"|')?(.*)(?:'|")?\)$/gm,"$1"),i=f),a(g).bind("load error",function(e){d.push(i),a.data(i,"loaded","error"==e.type?!1:!0),c.each instanceof Function&&c.each.call(i,d.slice(0)),d.length>=b.length&&c.all instanceof Function&&c.all.call(d),a(this).unbind("load error")}),g.src=h})},a.fn.imgpreload=function(b){return a.imgpreload(this,b),this},a.fn.imgpreload.defaults={each:null,all:null}}(jQuery);


/*
 * Put all your regular jQuery in here.
*/
jQuery(document).ready(function($) {
	
	var win = $(window)

	/*
	* Let's fire off the gravatar function
	* You can remove this if you don't need it
	*/
	loadGravatars();
	
	win.resize(function() {
		setLogoSize();
	});
	
	function setLogoSize() {
		var logo = $('#logo .main');
		var sub = $('#logo .sub');
		$.imgpreload(logo.css('background-image').replace('url(','').replace(')','').replace(/"/g,''), function() {
			imgHeight = ($.browser.msie && $.browser.version < 9) ? this[0].height : this[0].naturalHeight;
			imgWidth = ($.browser.msie && $.browser.version < 9) ? this[0].width : this[0].naturalWidth;
			imgRatio =  imgHeight / imgWidth;
			if (win.width() - 50 < imgWidth) {
				//sub.css('font-size',(sub.css('font-size').replace('px','')*logo.width()/imgWidth)+'px');
				logo.height(logo.width() * imgRatio);
			} else {
				logo.removeAttr('style');
				//sub.removeAttr('style');
			}
		});
	}
	setLogoSize();
	
	$('.TRIGGER_NAV').click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
		$('.MAIN_NAV').toggleClass('active');
	});

/*
* Page specific scripts
*/
	if ( typeof is_home === 'undefined' ) var is_home = $('body').hasClass('page-template-page-custom-home');
	
	if (is_home) {
		carousel($,$('.CAROUSEL'))
	}
	
	if ( typeof is_gallery === 'undefined' ) var is_gallery = $('body').hasClass('page-template-page-custom-gallery');
	
	if (is_gallery) {
		$('.GALLERY_CONTAINER .THUMBS').on('click','a',function(e) {
			e.preventDefault();
			var target;
			var activeItem = $('.gallery-item.active');
			if ($(this).hasClass('PREV')) {
				target = activeItem.prev().length > 0 ? activeItem.prev().find('a') : $('.gallery-item').last().find('a');
			} else if ($(this).hasClass('NEXT')) {
				target = activeItem.next().length > 0 ? activeItem.next().find('a') : $('.gallery-item').first().find('a');
			} else {
				target = $(this);
			}
			target.parents('figure').addClass('active').siblings().removeClass('active');
			var imgSrc = target.siblings('.IMG_SRC').val();
			$('.GALLERY_CONTAINER .DISPLAY .IMG_CONTAINER').fadeOut(350,function() {
				$(this).remove();
			});
			$('<div class="img-container IMG_CONTAINER"><img src='+imgSrc+' /></div>').appendTo('.GALLERY_CONTAINER .DISPLAY').fadeIn(350);
		})
		$('.GALLERY_CONTAINER .THUMBS a:first').click();
	}
	
	
	// Hide wp admin bar
	var adminBarMove = $('#wpadminbar').outerHeight()-1
	$('#wpadminbar').animate({
		'top':'-='+adminBarMove
	}, 2000,function() {
	}).hover(
		function(){
			$('#wpadminbar').stop().css('top','0').toggleClass('wpadminbar-shown');
		},
		function(){
			$('#wpadminbar').animate({
				'top':'-='+adminBarMove
			}, 2000).toggleClass('wpadminbar-shown');
		}
	).append('<div class="wpadminbar-activator"></div>');
}); /* end of as page load scripts */

function carousel($,carousel) {
	var carouselInterval = setInterval(function() {
		var current = carousel.find('.active').not('.exit');
		var next = current.next().length > 0 ? current.next() : current.siblings().first();
		carousel.find('.exit').removeClass('exit active');
		current.addClass('exit');
		next.addClass('active');
	}, 3000)
}