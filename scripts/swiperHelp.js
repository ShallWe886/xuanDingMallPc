define(["swiper","jquery"],function(swiper){
	var swiper = swiper;
	function loadCss(url) {
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = url;
	    document.getElementsByTagName("head")[0].appendChild(link);
	}

	var cssUrl = "../lib/swiper/swiper.min.css";
    loadCss(cssUrl);

    function start (){
	 	var mySwiper = new swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        paginationClickable: true,
	        loop: true,
	        autoplay: 2000
	    });
		$('.swiper-container').mouseenter(function () {
				mySwiper.stopAutoplay();
		})
		$('.swiper-container').mouseleave(function () {
				mySwiper.startAutoplay();
		})
    }

	return {
		"start":start
	}
})