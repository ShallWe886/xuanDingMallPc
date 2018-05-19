define(function (require, exports, module) {
	var common = require("scripts/common");
	var a = require("scripts/configuration");
	var imageBaseUrl = "";
	if(a){
		imageBaseUrl = a.imgBase;
	}
	var id = "";
	var orderId = "";
	var dictMap = {};


	function before(){

	}

	function init(){
		complate();
		var param = $.getPageParam();
		if(param && param.orderId && param.id){
			id = param.id;
			orderId = param.orderId;
			queryOrder();
		}else{
			$.alert("查询订单失败");
		}
		common.queryCommonHead();
	}




	function bindPageEvent(){
		$.bindEvent(".submit_box a",function(e){
			checkSubmit();
			e.stopPropagation();
		},"click");

		$.bindEvent(".service_type a",function(e){
			// var code = $(this).attr("data-code");
			$(".service_type a").removeClass("active");
			$(this).addClass("active");
			e.stopPropagation();			
		},"click")

		$.bindEvent(".type .upload #upload",function(e){
			var input = $(this).parents("form")[0];
			uploadPic(input,this);
			e.stopPropagation();
		},"change")

		$.bindEvent(".type .submit",function(e){
			checkSubmit();
			e.stopPropagation();
		},"click")
	}

	function destory(){

	}

	function complate(){
		dictMap = JSON.parse($.getSStorageInfo("dict"));
		dictMap = dictMap.after; 
		var childs = dictMap.childs;
		if(childs && childs.length){
			for(var i = 0;i<childs.length;i++){
				if(childs[i] && childs[i].nodeValue == "type"){
					var list = childs[i].childs;
					if(list && list.length > 0){
						var eleHtml = "";
						for(var j = 0;j<list.length;j++){
							eleHtml += '<a href="javascript:void(0);" data-code="'+ list[j].nodeValue +'">'+ list[j].nodeName +'</a>';
						}
						$(".sv_type .service_type").html(eleHtml);
					}
				}else if(childs[i] && childs[i].nodeValue == "reason"){
					var list = childs[i].childs;
					if(list && list.length > 0){
						var eleHtml = "";
						for(var j = 0;j<list.length;j++){
							eleHtml += '<option value="'+ list[j].nodeValue +'">'+ list[j].nodeName +'</option>';
						}
						$(".type select").append(eleHtml);
					}

				}
			}
		}
	}


	function checkSubmit(){
		var type = $(".sv_type .service_type a.active").attr("data-code");
		if(!type){
			$.alert("请选择售后类型");
			return;
		}
		var reason = $(".type select option:selected").val();
		if(!reason){
			$.alert("请选择申请原因");
			return;
		}
		var detail = $(".type .textarea").text();
		if(!detail){
			$.alert("请填写问题描述");
			return;
		}
		var phone = $(".type.mobile input").val();
		if(!phone){
			$.alert("请填写手机号码");
			return;
		}
		var userName = $(".type.user_name input").val();
		if(!userName){
			$.alert("请填写客户姓名");
			return;
		}
		var url = $(".small_pic").attr("data-src");

		function queryOrder(){
			var url = "/api/mall/order/after/sale/add";
			var paraMap = {
				"orderId":orderId,
				"itemId":id,
				"clientName":userName,
				"mobileNo":phone,
				"serviceType":type,
				"reason":reason,
				"detail":detail,
				"url":url || ""
			}
			$.invoke(url,paraMap,function(data){
				if(data){
					var errorNo = data.errorNo;
					var errorInfo = data.errorInfo;
					if(0 == errorNo){
						$.alert("售后申请成功,工作人员将在5个工作日内联系您",function(){
							window.location.href = "./myOrder.html";
						});
					}else{
						$.alert("售后申请失败,请稍后尝试");
					}
				}
			},function(data){
				$.alert("售后申请失败,请稍后尝试");
			});
		}
		queryOrder();
	}

	function queryOrder(){
		var url = "/api/mall/order/info/list";
		var paraMap = {
			"orderId":orderId
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result && result.length > 0){
						for(var i=0;i<result.length;i++){
							if(result[i].id == orderId){
								var items = result[i].orderItemList;
								for(var j = 0;j<items.length;j++){
									if(items[j].id == id){
										getProductInfo(items[j].productCode,items[j].quantity,items[j].skuCode);
									}
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

	function getProductInfo(code1,num,code2){
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
						eleHtml += '<div class="fl w740 pro_item">';
						eleHtml += '<i class="pro_img"><img src="'+ imageBaseUrl + result.medias[0].content +'"></i>';
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
						eleHtml += '</div>';
						eleHtml += '</div>';
						eleHtml += '</div>	';
						eleHtml += '<div class="w140 fl tc">';
						eleHtml += '<h6>商品价格</h6>';
						eleHtml += '<p>￥'+ result.price +'</p>';
						eleHtml += '</div>';
						eleHtml += '<div class="w140 fl tc">';
						eleHtml += '<h6>商品数量</h6>';
						eleHtml += '<p>'+ num +'</p>';
						eleHtml += '</div>';
						$(".service_box .shopping_item").html(eleHtml);
					}
				}else{
					$.alert(errorInfo);
				}
			}
		})
	}

	var getObjectURL = function (file) {
	    var url = null ;
	    if (window.createObjectURL!=undefined) { // basic
	        url = window.createObjectURL(file) ;
	    } else if (window.URL!=undefined) { // mozilla(firefox)
	        url = window.URL.createObjectURL(file) ;
	    } else if (window.webkitURL!=undefined) { // webkit or chrome
	        url = window.webkitURL.createObjectURL(file) ;
	    }
	    return url ;
	};


	function uploadPic(input,_this){
		$.ajax({
		    url: imageBaseUrl + "/api/file/upload",
		    type: 'POST',
		    cache: false,
		    data: new FormData(input),
		    processData: false,
		    contentType: false,
		    success: function (data) { 
		    	var result = data.result;
		    	console.log(result);
		    	if(result && result.length>0){
					var image = $(_this)[0].files[0];
					var eleHtml = '<span class="small_pic" data-src="'+ result[0].url +'"><img src="'+ getObjectURL(image) +'"></span>';
					$("#uploadForm").next().remove();
					$("#uploadForm").parent().append(eleHtml);
		    	}
		    },  
		    error: function (err) {
		    	console.log(err);
		    }  
		});
	}


	function uploadPj(id,itemId,mark,content,images){
		var url = "/api/mall/order/comment/add";
		var paraMap = {
			"orderId":id,
			"itemId":itemId,
			"images":images,
			"mark":mark,
			"content":content
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){

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