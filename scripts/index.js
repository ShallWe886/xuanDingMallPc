define(function (require, exports, module) {
	var common = require("scripts/common");
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){
		getBanner();
		queryTyreList();
		queryPartsList();
		queryNews();
		querySale();
		queryTop();
	}

	function init(){
		common.queryCommonHead();
	}
	
	function bindPageEvent(){
		$.bindEvent(".index_notice_wrap h3:eq(0) a",function(e){
			if($(this).hasClass("active")){
				return;
			}else{
				if($(this).hasClass("index_more")){
					// window.location.href="./newList.html?type=0";
					var index = $(".index_notice_wrap h3 .fl a.active").index();
					if(2 == index){
						window.location.href="./newList.html?type=0";
					}else if(0 == index){
						window.location.href="./newList.html?type=2";
					}
					return;
				}
				$(".index_notice_wrap h3:eq(0) a").removeClass("active");
				$(this).addClass("active");
				var index = $(this).index();
				if(0 == index){
					$(".huodong").show();
					$(".gonggao").hide();
				}else{
					$(".gonggao").show();
					$(".huodong").hide();
				}
			}
			e.stopPropagation();
		},"click");

		$.bindEvent(".index_menu ul .showAPP",function(e){
			$(".store_dialog_mask,.store_dialog,.appPic").show();
			$(".webPic").hide();
			e.stopPropagation();
		},"click");

		$.bindEvent(".index_menu ul .showWeb",function(e){
			$(".store_dialog_mask,.store_dialog,.webPic").show();
			$(".appPic").hide();
			e.stopPropagation();
		},"click");

		$.bindEvent(".store_dialog .dialog_close",function(e){
			$(".store_dialog_mask,.store_dialog").hide();
			$(".appPic,.webPic").hide();
			e.stopPropagation();
		},"click");
	}

	function destory(){

	}

	function getBanner() {
		var url = "/api/common/main/image/list";
		var paraMap = {
			"type":"1"
		}
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					var eleHtml = "";
					for(var i = 0;i<result.length;i++){
						eleHtml += '<li class="swiper-slide"><a href="' + result[i].jumpUrl + '"><img src="'+ imageBaseUrl + result[i].imageUrl +'"/></a></li>';
					}
					$(".top_banner .swiper-container .swiper-wrapper").html(eleHtml);
					require("scripts/swiperHelp").start();
				}
				// var smallBanner = results.smallBanner;
				// if(smallBanner && smallBanner.length >0){
				// 	for(var j = 0;j<smallBanner.length;j++){
				// 		$(".middle_banner .banner li img:eq("+ j +")").attr({"src":smallBanner[j].src});
				// 	}
				// }
			}
		});
		paraMap.type="2";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					var eleHtml = "";
					for(var i = 0;i<result.length;i++){
						if(result.length > 3){
							continue;
						}
						eleHtml += '<li><a href="' + result[i].jumpUrl + '"><img src="'+ imageBaseUrl + result[i].imageUrl +'"/></a></li>';
					}
					$(".index_show_pic ul").html(eleHtml);
				}
			}
		});
		paraMap.type="3";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					var eleHtml = "";
					for(var i = 0;i<result.length;i++){
						if(i > 0){
							continue;
						}
						eleHtml += '<li><a href="' + result[i].jumpUrl + '"><img src="'+ imageBaseUrl + result[i].imageUrl +'"/></a></li>';
					}
					$(".middle_banner .banner ul").html(eleHtml);
				}
			}
		});
		paraMap.type="4";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					$("#tyre_pic").attr({"src":imageBaseUrl + result[0].imageUrl});
				}
			}
		});
		paraMap.type="5";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					$("#parts_pic").attr({"src":imageBaseUrl + result[0].imageUrl});
				}
			}
		});
		paraMap.type="6";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					$("#sale_pic").attr({"src":imageBaseUrl + result[0].imageUrl});
				}
			}
		});
		paraMap.type="7";
		$.invoke(url,paraMap,function(data){
			if(data && data.errorNo == "0"){
				var result = data.result;
				if(result && result.length >0){
					$("#hot_pic").attr({"src":imageBaseUrl + result[0].imageUrl});
				}
			}
		});
	}

	function queryTyreList(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "category:1 && supportDiscount:0 && publishState:1",
			"fl":"",
			"sort":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result.list;
						if(list && list.length>0){
							var elehtml = "";
							for(var i = 0;i<list.length;i++){
								if(i>8){
									continue;
								}
								elehtml += '<li>';
								elehtml += '<div class="list_pro tyre_pro">';
								elehtml += '<a href="./pdDetail.html?productCode='+ list[i].productCode +'">';
								elehtml += '<span><img src="'+ imageBaseUrl + list[i].pic +'"/></span>';
								elehtml += '<div>';
								elehtml += '<h6>'+ list[i].pp +'</h6>';
								elehtml += '<p>'+ list[i].productName +'</p>';
								elehtml += '</div>';
								elehtml += '</a>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$(".tyre_ul").html(elehtml);
						}
					}
				}
			}
		},function(data){

		});
	}

	function queryPartsList(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "category:3 && supportDiscount:0 && publishState:1",
			"fl":"",
			"sort":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result.list;
						if(list && list.length>0){
							var elehtml = "";
							for(var i = 0;i<list.length;i++){
								if(i>8){
									continue;
								}
								elehtml += '<li>';
								elehtml += '<div class="list_pro tyre_pro">';
								elehtml += '<a href="./pdDetail.html?productCode='+ list[i].productCode +'">';
								elehtml += '<span><img src="'+ imageBaseUrl + list[i].pic +'"/></span>';
								elehtml += '<div>';
								elehtml += '<h6>'+ list[i].pjpp +'</h6>';
								elehtml += '<p>'+ list[i].productName +'</p>';
								elehtml += '</div>';
								elehtml += '</a>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$(".parts_ul").html(elehtml);
						}
					}
				}
			}
		},function(data){

		});
	}


	function queryNews(){
		var url = "/api/common/article/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var huodongHtml = '';
						var gonggaoHtml = '';
						var carHtml = '';
						var huodongLength = 0;
						var gonggaoLength = 0;
						var carLength = 0;
						result = result.list;
						for(var i = 0;i<result.length;i++){
							// 0 公告 1汽修常识 2活动
							if(result[i].type == "0"){
								if(gonggaoLength >4){
									continue;
								}
								gonggaoHtml += '<li><a href="./newDetail.html?type=0&id='+ result[i].id +'">'+ result[i].title +'</a></li>';
								gonggaoLength++;
							}else if(result[i].type == "1"){
								if(carLength >4){
									continue;
								}
								carHtml += '<li><a href="./newDetail.html?type=1&id='+ result[i].id +'">'+ result[i].title +'</a></li>';
								carLength++;
							}else{
								if(huodongLength >4){
									continue;
								}
								huodongHtml += '<li><a href="./newDetail.html?type=2&id='+ result[i].id +'">'+ result[i].title +'</a></li>';
								huodongLength++;
							}
						}
						$(".gonggao").html(gonggaoHtml);
						$(".car").html(carHtml);
						$(".huodong").html(huodongHtml);
					}
				}
			}
		})
	}


	function querySale(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "supportDiscount:1 && publishState:1",
			"fl":"",
			"sort":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result.list;
						if(list && list.length>0){
							var elehtml = "";
							for(var i = 0;i<list.length;i++){
								if(i>4){
									continue;
								}
								elehtml += '<li>';
								elehtml += '<span><img src="'+ imageBaseUrl + list[i].pic +'"/></span>';
								elehtml += '<div class="list_pro xsqg_pro">';
								elehtml += '<h6>'+ list[i].productName +'</h6>';

								elehtml += '<p>';
								elehtml += '<em>抢购价￥'+ list[i].price +'</em>';
								elehtml += '<del>原价￥'+ list[i].originalPrice + '</del>';
								elehtml += '<a class="pro_buy" href="./pdDetail.html?productCode='+ list[i].productCode +'">立即抢</a>';
								elehtml += '</p>';
								elehtml += '<i></i>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$("#sale .xsqg_inner ul").html(elehtml);
						}
					}
				}
			}
		})
	}

	function queryTop(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "supportDiscount:0 && publishState:1",
			"fl":"",
			"sort":"salesVolume desc"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result.list;
						if(list && list.length>0){
							var elehtml = "";
							for(var i = 0;i<list.length;i++){
								if(i>3){
									continue;
								}
								elehtml += '<li>';
								elehtml += '<div class="list_pro rank_pro">';
								elehtml += '<span><img src="'+ imageBaseUrl + list[i].pic +'"/>';
								elehtml += '<h6>'+ list[i].productName +'</h6>';
								elehtml += '<p>';
								elehtml += '<span class="price">热销价￥'+ list[i].price +'</span>';
								elehtml += '<a class="pro_buy" href="./pdDetail.html?productCode='+ list[i].productCode +'">立即抢</a>';
								elehtml += '</p>';
								elehtml += '</span>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$("#top .rank_inner ul").html(elehtml);
						}
					}
				}
			}
		})
	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});