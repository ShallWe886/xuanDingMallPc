define(function (require, exports, module) {
	var imageBaseUrl = "";
	var common = require("scripts/common");


	function before(){

	}

	function init(){
		common.queryCommonHead();
		var a = require("scripts/configuration");
		if(a){
			imageBaseUrl = a.imgBase;
		}
		var param = $.getPageParam();
		if(param && param.orderId){
			queryOrderState(param.orderId);
		}else{
			$.alert("未查询到订单编号");
		}
		queryLike();
	}

	function queryOrderState(id){
		var url = "/api/mall/order/info/list";
		var paraMap = {
			"orderId":id
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result && result.length > 0){
						for(var i=0;i<result.length;i++){
							if(result[i].id == id){
								var state = result[i].state;
								if(state == "7"){
									$("#fail").show();
								}else if(state == "2" || state == "8"){
									$("#success").show();
									$("#success .v_order a").attr({"href":"./orderDetail.html?orderId="+id})
								}
							}
						}
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询订单详情失败");
		});
	}

	function bindPageEvent(){
		/* 切换猜你喜欢 和 浏览历史 */
		$.bindEvent(".shopping_like .shopping_col li",function(e){
			if($(this).find("a").hasClass("active")){
				return;
			}
			var index = $(this).index();
			$(".shopping_like .shopping_like_list").hide();
			$(".shopping_like .shopping_col li a").removeClass("active");
			$(this).find("a").addClass("active");
			if(0 == index){
				queryLike();
				$(".like").show();
			}else{
				queryHistory();
				$(".history").show();
			}	
			e.stopPropagation();
		},"click")
	}

	function destory(){

	}

	function queryLike(){
		var url = "/api/mall/product/list";
		var paraMap = {
			"q": "publishState:1 && supportDiscount:0",
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
								var description = list[i].productDescription;
								if(description && description.length >16){
									description = description.substring(0,15);
								}
								elehtml += '<li>';
								elehtml += '<div class="browse_item">';
								elehtml += '<h6>'+ description +'</h6>';
								elehtml += '<i><img src="'+ imageBaseUrl + list[i].pic +'"/></i>';
								elehtml += '<span>￥'+ list[i].price +'</span>';
								elehtml += '<a class="tyre_buy" href="./pdDetail.html?productCode='+ list[i].productCode +'">购买</a>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$(".like ul").html(elehtml);
						}
					}
				}
			}
		})
	}

	function queryHistory(){
		var url = "/api/mall/recent/product/list";
		var paraMap = {
			"productCode":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result;
						if(list && list.length>0){
							var elehtml = "";
							for(var i = 0;i<list.length;i++){
								if(i>5){
									continue;
								}
								var description = list[i].productDescription;
								if(description && description.length >16){
									description = description.substring(0,15);
								}
								elehtml += '<li>';
								elehtml += '<div class="browse_item">';
								elehtml += '<h6>'+ description +'</h6>';
								elehtml += '<i><img src="'+ imageBaseUrl + list[i].pic +'"/></i>';
								elehtml += '<span>￥'+ list[i].price +'</span>';
								elehtml += '<a class="tyre_buy" href="./pdDetail.html?productCode='+ list[i].productCode +'">购买</a>';
								elehtml += '</div>';
								elehtml += '</li>';
							}
							$(".history ul").html(elehtml);
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