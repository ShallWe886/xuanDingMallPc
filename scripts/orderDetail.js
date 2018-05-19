define(function (require, exports, module) {
	var common = require("scripts/common");
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}
	var change =  false;
	var platForm = {
		"0":"支付宝支付",
		"1":"微信支付",
		"2":"余额支付",
		"3":"银行卡支付"
	}
	var totalMoney = 0;
	var state = "0";//支付状态

	function before(){

	}

	function init(){
		var id = $.getPageParam("orderId");
		$(".order_progress_wrap .order_tit").html("订单编号："+id);
		common.queryCommonHead();
		queryOrder(id);
	}

	function bindPageEvent(){

	}

	function destory(){

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
								state = result[i].state;
								if(state && state != "0" && state != "1" && state != "7"){
									$(".order_payment").show();
									var payPlatform = result[i].payPlatform;
									$(".pay_way").text(platForm[payPlatform]);
								}
								for(var j = 0;j<items.length;j++){
									getProductInfo(items[j].productCode,items[j].quantity,items[j].skuCode,items[j].orderId,items[j].id);
								}
								setColor(state);
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

	function setColor(state){
		//订单已经创建
		if(state == "0" || state == "1" || state == "7" || state == "2" ||  state == "9"){
			$(".order_progress_wrap .order_progress li:eq(0)").addClass("order_finish");
		//已经发货
		}else if(state == "3"){
			$(".order_progress_wrap .order_progress li:lt(3)").addClass("order_finish");
		//已经收货
		}else if(state == "4"){
			$(".order_progress_wrap .order_progress li:lt(5)").addClass("order_finish");
		//订单完成
		}else if(state == "8"){
			$(".order_progress_wrap .order_progress li").addClass("order_finish");
		}
	}

	function getProductInfo(code1,num,code2,orderId,id){
		var url = "/api/mall/product/get";
		if(!code2){
			url = "/api/mall/product/spu/get";
		}
		var paraMap = {
			"productCode":code1,
			"skuCode":code2
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var eleHtml = "";
						eleHtml += '<li><div class="clearfix shopping_item detail_box">';
						eleHtml += '<div class="fl w740 pro_item">';
						eleHtml += '<i class="pro_img"><img src="'+ imageBaseUrl + result.medias[0].content +'"/></i>';
						eleHtml += '<div class="pro_info">';
						eleHtml += '<h6>'+ result.description +'</h6>';
						eleHtml += '<div class="pro_index">';
						eleHtml += '<ul class="clearfix">';

						var fieldNames = result.fieldNames;
						var properties = result.properties;
						if(fieldNames){
							for(i in fieldNames){
								eleHtml += '<li>' + fieldNames[i] +':'+ result[i] +'</li>';
							}
						}else if(properties){
							for(var i = 0;i<properties.length;i++){
								if(i >5){
									continue;
								}
								eleHtml += '<li>' + properties[i].name +':'+ properties[i].value +'</li>';
							}
						}
						eleHtml += '</ul>';
						eleHtml += '</div></div></div>';
						eleHtml += '<div class="w140 fl tc"><h6>商品价格</h6><p>￥'+ result.price +'</p></div>';
						eleHtml += '<div class="w140 fl tc"><h6>商品数量</h6><p>'+ num +'</p></div>';
						if(state == "0"){
							eleHtml += '<div class="w140 fl tc"><h6>操作</h6><a href="./pay.html?orderId='+ orderId + '">立即支付</a></div>';
						}else{
							eleHtml += '<div class="w140 fl tc"><h6>操作</h6><a href="./service.html?orderId='+ orderId +'&id=' + id +'">申请售后</a></div>';							
						}
						eleHtml += '</div></li>';
						totalMoney += Number(result.price) * Number(num);
						$(".pay_money").html(totalMoney+"元");
						// $(".settlement_list .settlement_pro>ul").append(listHtml);
						$(".order_goods_list>ul").append(eleHtml);
					}
				}else{
					$.alert(errorInfo);
				}
			}
		})
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
								$(".address").html(province + city + region +"<br/>" + result[i].address);
								$(".phone").html(result[i].tel);
								$(".email").html(result[i].email);
							}
						}
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询到用户地址");
		});
	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});