define(function (require, exports, module) {
	var common = require("scripts/common");
	var id = "";
	var pointNum = "";
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}
	var payWay = "2";//默认银行卡支付
	var payPlatform = "3";//支付平台

	function before(){

	}

	function init(){
		common.queryCommonHead();
		id = $.getPageParam("orderId");
		pointNum = $.getPageParam("pointNum");
		if(id){
			queryOrder(id);
		}else if(pointNum){
			$(".payment_info").html('<p>商品名称：<span>积分充值</span><em>X'+ pointNum +'</em></p>').show();
		}else{
			$.alert("订单编号不存在");
			return;
		}
	}

	function queryOrder(id){
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
								var adressId = result[i].address;
								queryAdress(adressId);
								var items = result[i].orderItemList;
								var eleHtml = "";
								for(var j = 0;j<items.length;j++){
									// getProductInfo(items[j].productCode,items[j].quantity,items[j].skuCode,items[j].orderId,items[j].id);
									eleHtml += '<p>商品名称：<span>'+ items[j].productName +'</span><em>X'+ items[j].quantity +'</em></p>';
								}
								$(".payment_info").append(eleHtml);
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

	function queryAdress(id){
		var url = "/api/common/client/address/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					var localCity = JSON.parse($.getSStorageInfo("localCity"));
					if(result && result.length > 0){
						for(var i=0;i<result.length;i++){
							if(result[i].id == id){
								if(localCity){
									province = localCity[result[i].province].regionName;
									city = localCity[result[i].city].regionName;
									region = localCity[result[i].region].regionName;
								}
								$(".name").html(result[i].name);
								$(".address").html(province + city + region + result[i].address);
							}
						}
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		})
	}


	function bindPageEvent(){
		$.bindEvent($(".payment_info_state a"),function(e){
			$(this).toggleClass("active");
			$(".payment_info").slideToggle("400");
			e.stopPropagation();
		},"click")

		$.bindEvent("button",function(e){
			var code = $("#cardNum").val();
			if(!code){
				$.alert("银行卡号不能为空");
				return;
			}
			if(pointNum){
				startPointsPay();
			}else{
				startOrderPay();
			}
			e.stopPropagation();
		},"click")

		$.bindEvent(".payment_way a",function(e){
			var className  = $(this).attr("class");
			if(className){
				className = className.replace("icon","");
			}
			$(".payment_content_wrap").hide();
			$("." + className).show();
			e.stopPropagation();
		},"click")
	}

	function destory(){

	}

	function startPointsPay(){
		var url = "/api/pay/account/recharge";
		var paraMap = {
			"payPlatform":payPlatform,
			"payWay":payWay,
			"payAccount":$("#cardNum").val() || "",
			"returnUrl":imageBaseUrl + "/mall/views/index.html",
			"amount":pointNum,
			"remark":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						if(result.content){
							runCode(result.content);
							$("#cardNum").val("");
							$.confirm("支付已经完成？",function(index){
								window.location.href="./finish.html?orderId="+id;
								$.close(index);
							},function(){
								window.location.href="./finish.html?orderId="+id;
							},{
								"btn":["支付完成","支付失败"]
							})
						}
					}
				}
			}
		})
	}

	function startOrderPay(){
		var url = "/api/mall/order/info/pay";
		var paraMap = {
			"orderId":id,
			"payPlatform":payPlatform,
			"payWay":payWay,
			"payAccount":$("#cardNum").val() || "",
			"returnUrl":imageBaseUrl + "/mall/views/index.html"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						if(result.content){
							runCode(result.content);
							$("#cardNum").val("");
							$.confirm("支付已经完成？",function(index){
								window.location.href="./finish.html?orderId="+id;
								$.close(index);
							},function(){
								window.location.href="./finish.html?orderId="+id;
							},{
								"btn":["支付完成","支付失败"]
							})
						}
					}
				}
			}
		})
	}

	function runCode(html){  
	  var newwin=window.open('','','');
	  newwin.opener = null;
	  newwin.document.write(html);
	  newwin.document.close();
	}



    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});