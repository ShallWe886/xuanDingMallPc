// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "../lib",
    "paths": {
      "scripts": "../scripts",
      "swiper": "../lib/swiper/swiper.min",
      "layer": "../lib/layer/layer"
    },
　　shim: {
　　　　'layer': {
　　　　　　deps: ['jquery'],
　　　　　　exports: "layer"
　　　　}
　　}
});

	// var pageCode = $("body>div:first").attr("data-pageCode");
	var pageCodeEle = document.getElementsByClassName("page");
	var pageCode = pageCodeEle[0].getAttribute('data-pageCode');
 	require(["scripts/common"],function(b){
 		// $("body").append('<script src="../lib/layer/layer.js"></script>');
 		b.checkPerssion(pageCode);
 		return;
 	})

// Load the main app module to start the app
// requirejs(["scripts/swiperHelp"]);
