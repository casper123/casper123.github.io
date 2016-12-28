
(function($) { 
	"use strict";
//For background slider
$(function() {
			
	$( '#ri-grid' ).gridrotator( {
		rows		: 4,
		columns		: 8,
		animType	: 'fadeInOut',
		animSpeed	: 1000,
		interval	: 600,
		step		: 1,
		
		w1024		: {
			rows	: 5,
			columns	: 6
		},
		w768		: {
			rows	: 7,
			columns	: 4
		},
		w480		: {
			rows	: 4,
			columns	: 3
		},
		w320		: {
			rows	: 4,
			columns	: 2
		},
		w240		: {
			rows	: 4,
			columns	: 2
		}
	} );

});



// for banner height js
var windowWidth = $(window).width();
    var windowHeight =$(window).height();
    $('.banner').css({'width':windowWidth ,'height':windowHeight -"60" });
	
	


// for portfoli filter jquary
$(window).load(function(){
    var $container = $('.portfolioContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
 
    $('.portfolioFilter a').click(function(){
        $('.portfolioFilter .current').removeClass('current');
        $(this).addClass('current');
 
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
         });
         return false;
    }); 
});




// for portfoli lightbox jquary
jQuery(function($) {
	var $chosenSheet,
	$stylesheets = $( "a[id^=theme-]" );
	
	// run rlightbox
	$( ".lb" ).rlightbox();
	$( ".lb_title-overwritten" ).rlightbox({overwriteTitle: true});
});





// for skill chat jquary
$(document).ready(function(e) {
//var windowBottom = $(window).height();
var index=0;

var projects = [];

$.getJSON( "project.json", function( data ) {

  projects = data;
  var html = '';
  
  $.each(data, function( key, val ) {

  	var icon = val.icon;

  	if(icon == '')
  		icon = 'http://placehold.it/300?text=' + val.Project;


  	html = html + '<li class="'+ val.Type +' col-xs-6 col-sm-4 col-md-3 col-lg-3">' +
          '<div class="lightCon">' +
            '<span class="hoverBox">' + 
              '<span class="smallIcon">' +
                '<a data-project="'+ key +'" name="protfolioLink" href="#" data-toggle="modal" data-target=".modal-lgx" class="zoom lb lb_warsaw1"><i class="fa fa-search fa-2x"></i></a>' +
                '<a href="#" title="Project Link" target="_blank" class="linKed"><i class="fa fa-link fa-2x"></i></i></a>' + 
              '</span>' +
            '</span>' + 
            '<img src="'+ icon +'" alt="">' +
          '</div>' +
        '</li>';
  });

  console.log(html);
  $(".portfolioContainer").html(html);
});

	
$(document).scroll(function(){

	

	var top = $('.technical').height()-$(window).scrollTop();
	console.log(top)
	if(top<-300){
		if(index==0){	
			
			$('.chart').easyPieChart({
				easing: 'easeOutBounce',
				onStep: function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				}
			});
			
		}
		index++;
	}
})
	
	$('body').on('click', 'a[name="protfolioLink"]', function(){
		var id = $(this).data("project");
		console.log(projects[id]);
		$("#modalTitle").html(projects[id].Project);
		$("#modalBody").html(projects[id].Description);
		$("#modalFrame").attr('src', projects[id].iframe_url);
		$("#modalLink").attr('href', projects[id].Link);
		$("#modalClient").html(projects[id].client_name);
		$("#modalTech").html(projects[id].technology);
		
		$("#modalRegionImg").attr('src', 'http://www.geonames.org/flags/x/' + projects[id].Region.toLowerCase() + '.gif');
	});
});




// Somth page scroll
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top -60
        }, 1000);
        return false;
      }
    }
  });
});




// chart loding
$(window).load(function() {
	
	var chart = window.chart = $('.chart').data('easyPieChart');
	$('.js_update').on('click', function() {
		chart.update(Math.random()*100);
	});
});


}(jQuery));
