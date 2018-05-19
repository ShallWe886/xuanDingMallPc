define(function (require, exports, module) {
	var common = require("scripts/common");
	var allArr = [];//所有订单
	var pay = [];//待支付订单
	var take = [];//待收货订单
	// var install = [];//待安装订单
	var evaluate = [];//待评价订单
	var finish = [];//已完成订单
	var stateMap = {
		"0":"待付款",
		"1":"待付款",
		"2":"待发货",
		"3":"待收货",
		"4":"已收货",
		"7":"待付款",
		"8":"已完成",
		"9":"已关闭"
	}
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){

	}

	function init(){
		queryOrder();
		common.queryCommonHead();
	}

	function bindPageEvent(){
		$.bindEvent(".info_tit .clearfix li",function(e){
			if($(this).find("a").hasClass("active")){
				return;
			}else{
				$(".info_tit .clearfix li a").removeClass("active");
				$(this).find("a").addClass("active");
			}
			var index = $(this).index();
			if(index == 0){
				drawList(allArr,".order_bill_list:eq(0)")
			}else if(index == 1){
				drawList(pay,".order_bill_list:eq(1)")
			}else if(index == 2){
				drawList(take,".order_bill_list:eq(2)")
			}else if(index == 3){
				drawList(evaluate,".order_bill_list:eq(3)")
			}else if(index == 4){
				drawList(finish,".order_bill_list:eq(4)")
			}
			$(".order_bill_list").hide();
			$(".order_bill_list:eq("+ index +")").show();
			e.stopPropagation();
		},"click");

		$.preBindEvent(".order_bill_list",".over",function(e){
			var id = $(this).attr("data-id");
			$.confirm("是否确认收货",function(index){
				confirmOrder(id);
				$.close(index);
			})
			e.stopPropagation();
		},"click");

		$.preBindEvent(".order_bill_list",".cancel_order",function(e){
			var id = $(this).attr("data-id");
			$.confirm("是否取消该订单",function(index){
				cancelOrder(id);
				$.close(index);
			})
			e.stopPropagation();
		},"click");
	}

	function destory(){

	}

	function confirmOrder(id){
		var url = "/api/mall/order/info/comfirm";
		var paraMap = {
			"orderId":id
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					$.alert("确认收货成功");
					queryOrder();
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("确认收货失败");
		});
	}

	function cancelOrder(id){
		var url = "/api/mall/order/info/cancel";
		var paraMap = {
			"orderId":id
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					$.alert("取消订单成功");
					queryOrder();
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("取消订单失败");
		});
	}

	function queryOrder(){
		var url = "/api/mall/order/info/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result && result.length > 0){
						for(var i=0;i<result.length;i++){
							if(result[i].state == 0 || result[i].state == 1 || result[i].state ==7){
								pay.push(result[i]);
							}else if(result[i].state == 3){
								take.push(result[i]);
							}else if(result[i].state == 4){
								evaluate.push(result[i]);
							}else if(result[i].state == 8){
								finish.push(result[i]);
							}
						}
						allArr = result;
						$(".info_tit .clearfix li:eq(0) em").text(allArr.length);
						$(".info_tit .clearfix li:eq(1) em").text(pay.length);
						$(".info_tit .clearfix li:eq(2) em").text(take.length);
						$(".info_tit .clearfix li:eq(3) em").text(evaluate.length);
						$(".info_tit .clearfix li:eq(4) em").text(finish.length);
						drawList(allArr,".order_bill_list:eq(0)");
					}else{
						$(".info_tit .clearfix li em").text("0");
					}
				}else{
					$.alert(errorInfo);
					$(".info_tit .clearfix li em").text("0");
				}
			}
		},function(data){
			$(".info_tit .clearfix li em").text("0");
			$.alert("查询订单失败");
		});
	}

	function drawList(arr,ele){
		var eleHtml = "";
		
		for(var i = 0 ; i< arr.length; i++){
			var totalMoney = 0;
			eleHtml += '<div class="order_bill_item"><h3><span>订单编号：'+ arr[i].id +'</span>';
			eleHtml += '<span>'+ $.formatDate(arr[i].createTime) +'</span></h3>';
			eleHtml += '<ul class="clearfix">';
			for(var j = 0;j<arr[i].orderItemList.length;j++){
				eleHtml += '<li class="order_bill_pro pro_item">';
				eleHtml += '<i class="pro_img"><img src="' + imageBaseUrl + arr[i].orderItemList[j].pic + '"/></i>';
				eleHtml += '<div class="pro_info"><h6>'+ arr[i].orderItemList[j].productDescription +'</h6>';
				eleHtml += '<h5>'+ arr[i].orderItemList[j].price +'元 X ' + arr[i].orderItemList[j].quantity +'</h5></div>';
				totalMoney +=  Number(arr[i].orderItemList[j].price)* Number(arr[i].orderItemList[j].quantity);
			}
			eleHtml += '</ul>';
			eleHtml += '<div class = "clearfix total"><ul>';
			eleHtml += '<li><span class="order_bill_info">￥' + totalMoney+ '</span></li>';
			eleHtml += '<li><span class="order_bill_info fc_red">￥' + totalMoney+ '</span></li>';
			eleHtml += '<li><span class="order_bill_info">'+ stateMap[arr[i].state] +'</span></li>';
			eleHtml += '<li class="order_bill_opera">';
			if(arr[i].state == "0" || arr[i].state == "1" || arr[i].state =="7"){
				eleHtml += '<a class="fc_gray6" href="./pay.html?orderId='+arr[i].id+'">立即支付</a>';
			}else if(arr[i].state == "2" || arr[i].state == "3" || arr[i].state =="8"){
				eleHtml += '<a class="fc_gray6 over" data-id="'+ arr[i].id +'"  href="javascript:void(0);">确认收货</a>';	
			}else if(arr[i].state == "4"){
				eleHtml += '<a class="fc_gray6" href="./evaluate.html?id='+ arr[i].id +'">立即评论</a>';
			}else if(arr[i].state == "8"){
				eleHtml += '<a class="fc_gray6" href="javascript:void(0);">已完成</a>';
			}

			eleHtml += '<a class="fc_blue dropDetail" href="./orderDetail.html?orderId='+ arr[i].id +'">订单详情</a>';
			if(arr[i].state == "0"){
				eleHtml += '<a class="fc_gray6 dropDetail cancel_order" data-id="'+ arr[i].id +'"  href="javascript:void(0);">取消订单</a></li></ul>';				
			}
			eleHtml += '</div>';
			eleHtml += '<a class="order_delete" href="javascript:void(0);">删除</a></div>';
		}
		$(ele).html(eleHtml);
	}



    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});