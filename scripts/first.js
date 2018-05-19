 define(["jquery","scripts/configuration","layer"],function($,config,layer){
	layer.config({
	　　path: '../lib/layer/layer'      //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

 	var pageCode = $("body>div:first").attr("data-pageCode");
 	// require(["scripts/common"],function(b){
 	// 	b.checkPerssion(pageCode);
 	// }

 	require(["scripts/"+pageCode],function(a){
 		// $("body").append('<script src="../lib/layer/layer.js"></script>');
 		a.before();
 	})
})