define(function (require, exports, module) {
	var common = require("scripts/common");
	var dictMap = {};
	var dictList = ["pjmc","pjpp"];//搜索条件
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){

	}

	function init(){
		dictMap = JSON.parse($.getSStorageInfo("dict"));
		common.queryCommonHead();
		queryTyreList();
		getQueryDict();
		queryHistory();
		queryCommon();
		getBanner();
	}

	function getBanner() {
		var url = "/api/common/main/image/list";
		var paraMap = {
			"type":"8"
		}
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
					$(".tyre_ads ul").html(eleHtml);
				}
			}
		});
	}


	function bindPageEvent(){
		$.preBindEvent(".tyre_filter_condition dl","a",function(e){
			if($(this).hasClass("active")){
				return;
			}else{
				$(this).parents("dl").find("a").removeClass("active");
				$(this).addClass("active");
			}
			getQueryString();
			e.stopPropagation();
		},"click");

		$.preBindEvent(".parts_list ul","li",function(e){
			var productCode = $(this).attr("data-productCode");
			if(productCode){
				window.location.href = "./pdDetail.html?productCode="+productCode;
			}
			e.stopPropagation();
		},"click");

		$.bindEvent(".pro_data ul li a",function(e){
			$(".pro_data ul li a").removeClass("active");
			$(this).addClass("active");
			var s = $(this).attr("data-sort");
			getQueryString(s);
			e.stopPropagation();
		},"click");

		$.bindEvent(".more",function(e){
			$(this).parent().addClass("active");
			$(this).hide().siblings(".hide").show();
			e.stopPropagation();
		},"click")

		$.bindEvent(".hide",function(e){
			$(this).parent().removeClass("active");
			$(this).hide().siblings(".more").show();
			e.stopPropagation();
		},"click")
	}

	function destory(){

	}

	function getBanner() {
		var url = "/api/common/main/image/list";
		var paraMap = {
			"type":"8"
		}
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
					$(".tyre_ads ul").html(eleHtml);
				}
			}
		});
	}

	function getQueryString(sort,num) {
		var arr = [];
		$(".tyre_filter_condition dl").each(function(){
			if($(this).find(".active").text() != "不限"){
				var nodeName = $(this).attr("class").replace("clearfix","").trim();
				arr.push(nodeName + ":" +$(this).find(".active").text());
			}
		});
		arr.push("category:3");
		var queryString = arr.join(" && ");
		queryTyreList(queryString,sort,num);
	}

	function getQueryDict(){
		for(var i=0;i<dictList.length;i++){
			var kind = dictMap[dictList[i]];
			var children = kind.childs;
			var elehtml = "";
			for(var j = 0;j<children.length;j++){
				elehtml += '<dd><a href="javascript:void(0);">'+ children[j].nodeName +'</a></dd>';
			}
			if(children.length > 8){
				// $(".parts_filter_condition").addClass("active");
				$(".tyre_filter_condition ."+kind.nodeValue).siblings("span.more").show();
			}
			$(".tyre_filter_condition ."+kind.nodeValue).append(elehtml);
		}
	}

	function setPageNum(pageNum,pageSize,totalNum){
		// totalNum = 101;
		var totalPage = Math.ceil(Number(totalNum)/Number(pageSize));
		var elehtml = "";
		// elehtml+='<div class="clearfix pro_page">';
		// elehtml+='<ul>';

		if(1 == totalPage){
			elehtml+='<li><a class="active" href="javascript:void(0);">1</a></li>';
		}else if(totalPage > 1 && pageNum == 1){
			elehtml+='<li><a class="active" href="javascript:void(0);">1</a></li>';
			elehtml+='<li><a href="javascript:void(0);">2</a></li>';
			elehtml+='<li><a class="plr8" href="javascript:void(0);" data-page = "' + 2 + '">下一页&gt;</a></li>';
		}else if(totalPage > 1 && pageNum == totalPage){
			elehtml+='<li><a class="plr8" href="javascript:void(0);" data-page = "' + (pageNum-1) + '">&lt;上一页</a></li>';
			elehtml+='<li><a href="javascript:void(0);">' + (pageNum-1) + '</a></li>';
			elehtml+='<li><a class="active" href="javascript:void(0);">' + pageNum + '</a></li>';
		}else{
			elehtml+='<li><a class="plr8" href="javascript:void(0);" data-page = "' + (pageNum-1) + '">&lt;上一页</a></li>';
			elehtml+='<li><a href="javascript:void(0);">' + (pageNum-1) + '</a></li>';
			elehtml+='<li><a class="active" href="javascript:void(0);">' + pageNum + '</a></li>';
			elehtml+='<li><a href="javascript:void(0);">' + (pageNum+1) + '</a></li>';
			elehtml+='<li><a class="plr8" href="javascript:void(0);" data-page = "' + (pageNum+1) + '">下一页&gt;</a></li>';
		}

		elehtml+='<li><span>共'+ pageNum +'页</span></li>';
		elehtml+='<li class="pro_page_edit">';
		elehtml+='<span class="fl">到第</span>';
		elehtml+='<input class="fl" type="text" value="1" id="pageValue"/>';
		elehtml+='<span class="fl">页</span>';
		elehtml+='<a class="fl" href="javascript:void(0);">确定</a>';
		elehtml+='</li>';
		// elehtml+='</ul>';
		// elehtml+='</div>';
		$(".pro_page ul").html(elehtml);

		var s = $(".pro_data ul li a.active").attr("data-sort");

		$.bindEvent(".pro_page ul .plr8",function(e){
 			var page = $(this).attr("data-page");
 			getQueryString(s,page);
 			e.stopPropagation();
		},"click");

		$.bindEvent("#pageValue",function(e){
			var val = $(this).val();
 			if(val > totalPage){
 				val = totalPage;
 			}
 			$(this).val(val);
 			getQueryString(s,val);
 			e.stopPropagation();
		},"input");

		$.bindEvent(".pro_page ul li a:not('.plr8')",function(e){
 			var page = $(this).text();
 			getQueryString(s,page);
 			e.stopPropagation();
		},"click");
	}

	function queryCommon(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "publishState:1 && supportDiscount:0",
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
						var elehtml = "";
						var list = result.list;
						for(var i = 0; i<list.length;i++){
							if(i>2){
								continue;
							}
							var productDescription = list[i].productDescription;
							if(productDescription.length > 30){
								productDescription = productDescription.substring(0,29);
							}
							elehtml += '<li>';
							elehtml += '<div class="browse_item">';
							elehtml += '<i><img src="'+ imageBaseUrl + list[i].pic +'"/></i>';
							elehtml += '<a href="javascript:void(0);">';
							elehtml += '<h6>'+ productDescription +'</h6>';
							elehtml += '<em>￥'+ list[i].price +'</em>';
							elehtml += '</a>';
							elehtml += '</div>';
							elehtml += '</li>';					
						}
						$(".browse_wrap .browse_list.rec_list ul").html(elehtml);
					}
				}
			}
		})
	}

	function queryTyreList(q,s,num){
		if(s){
			if(s != "price"){
				s = s + " desc";
			}else{
				s = s + " asc";
			}
		}
		if(q){
			q = q + " && publishState:1 && supportDiscount:0"
		}
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": q || "category:3 && publishState:1 && supportDiscount:0",
			"fl":"",
			"sort":s || "",
			"pageNum":num || ""
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
								var description = list[i].productDescription;
								if(description && description.length >40){
									description = description.substring(0,39);
								}
								elehtml += '<li data-productCode="'+ list[i].productCode +'">';
								elehtml += '<div class="parts_product">';
								elehtml += '<span>';
								elehtml += '<img src="'+ imageBaseUrl + list[i].pic +'"/>';
								elehtml += '</span>';
								elehtml += '<h6>'+ description +'</h6>';
								elehtml += '<p>';
								elehtml += '<strong>¥' + list[i].price + '</strong>';
								elehtml += '<span>' + (list[i].ljxl || 0)+ '人购买</span>';
								elehtml += '</p>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$(".parts_list ul").html(elehtml);
							setPageNum(result.pageNum,result.pageSize,result.total);
							$(".pro_page").show();
						}else{
							$(".pro_list ul").html("");
							$(".pro_page").hide();
							$(".parts_list ul").html("");
						}
					}else{
						$(".pro_list ul").html("");
						$(".pro_page").hide();
						$(".parts_list ul").html("");
					}
				}else{
					$.alert(errorInfo);
					$(".pro_list ul").html("");
					$(".pro_page").hide();
					$(".parts_list ul").html("");
				}
			}
		},function(data){
			$.alert("未查询到符合条件的商品");
		});
	}

	function queryHistory(){
		var url = "/api/mall/recent/product/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var eleHtml = '';
						for(var i = 0;i<result.length;i++){
							if(i>1){
								continue;
							}
							eleHtml += '<li>';
							eleHtml += '<div class="browse_item">';
							eleHtml += '<h6>'+ result[i].productName +'</h6>';
							eleHtml += '<i><img src="'+ imageBaseUrl + result[i].pic +'"/></i>';
							eleHtml += '<span>￥'+ result[i].price +'</span>';
							eleHtml += '<a class="tyre_buy" href="./pdDetail.html?productCode='+ result[i].productCode +'">购买</a>';
							eleHtml += '</div>';
							eleHtml += '</li>';
						}
						$(".browse_wrap .browse_list:eq(0) ul").html(eleHtml);
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