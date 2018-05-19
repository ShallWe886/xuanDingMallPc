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
		if(param && param.productCode){
			var code = param.skuCode || "";
			showSuccess(param.productCode,code);
		}else{
			queryCart();
		}
		queryLike();

		// getProductInfo("MQL002","MQL002-1");
	}

	function bindPageEvent(){

		/* 数量输入 */
		$.preBindEvent(".shopping_table",".shopping_num input",function(e){
			$(this).val($(this).val().replace(/[^0-9]/ig,"").replace(/\b(0+)/gi,""));
			if("" == $(this).val()){
				$(this).val(1);
			}
			calcMoney("input",this);
			totalMoney();
			e.stopPropagation();
		},"input")

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

		/* 数量增减 */
		$.preBindEvent(".shopping_table",".shopping_num i",function(e){
			// var val = $(".shopping_num input").val();
			var val = $(this).siblings("input").val();
			var amount = Number(val);
			var productCode = $(this).parents("li").find("#pro01").attr("data-pdCode");
			var skuCode = $(this).parents("li").find("#pro01").attr("data-skuCode");
			if($(this).hasClass("less")){
				if(amount <=1){
					amount = 1;
				}else{
					amount--;
					deleteCart(productCode,skuCode);
				}
			}else{
				amount++;
				addCart(productCode,skuCode);
			}
			$(this).siblings("input").val(amount);
			calcMoney("i",this);
			totalMoney();
			e.stopPropagation();
		},"click")

		$.preBindEvent(".shopping_list ul",".delete",function(e){
			var productCode = $(this).parents("li").find("#pro01").attr("data-pdCode");
			var skuCode = $(this).parents("li").find("#pro01").attr("data-skuCode");
			var num = $(this).parents("li").find(".shopping_num input").val();
			deleteCart(productCode,skuCode,num);
			e.stopPropagation();
		},"click");

		$.bindEvent("#pro_all1",function(e){
			if($(this).is(":checked")){
				$(".shopping_item_wrap .shopping_checked input").prop("checked",true);
			}else{
				$(".shopping_item_wrap .shopping_checked input").prop("checked",false);
			}
			totalMoney();
			e.stopPropagation();
		},"click")

		$.preBindEvent(".shopping_table",".shopping_item_wrap .shopping_checked input",function(e){
			totalMoney();
			var isAllCheck = true;
			$(".shopping_table .shopping_item_wrap .shopping_checked input").each(function(){
				if(!$(this).is(":checked")){
					isAllCheck = false;
				}
			})
			if(isAllCheck){
				$("#pro_all1").prop("checked",true);
			}else{
				$("#pro_all1").prop("checked",false);
			}
			e.stopPropagation();
		},"click");

		$.bindEvent("#submit",function(e){
			var arr = [];
			$(".shopping_item_wrap .shopping_checked input").each(function(){
				if($(this).is(":checked")){
					var productCode = $(this).attr("data-pdCode");
					var skuCode = $(this).attr("data-skuCode");
					var num = $(this).parents(".shopping_item_wrap").find(".shopping_num input").val();
					arr.push({"productCode":productCode,"skuCode":skuCode,"number":num+""});
				}
			});
			if(arr.length == 0){
				layer.alert("请选择需要结算的商品");
			}else{
				$.setSStorage("shopList",JSON.stringify(arr));
				window.location.href = "./confirm.html";
				// $.pageInit("./confirm.html",{"today":"good"});
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
							$(".history ul").html(elehtml);
						}
					}
				}
			}
		})
	}

	function addCart(productCode,code){
		var url = "/api/mall/cart/add";
		var paraMap = {
			"num":"1",
			"productCode":productCode,
			"skuCode":code
		}
		$.invoke(url,paraMap,function(data){
			if(data){

			}
		})
	}


	function deleteCart(productCode,code,num){
		var url = "/api/mall/cart/delete";
		var paraMap = {
			"num":num || "1",
			"productCode":productCode,
			"skuCode":code
		}
		$.invoke(url,paraMap,function(data){
			if(num){
				queryCart();
			}
		})
	}

	function showSuccess(code1,code2){
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
						$(".shopping_success").show();
						var fieldNames = result.fieldNames;
						var properties = result.properties;
						var liHtml = "";
						if(fieldNames){
							for(i in fieldNames){
								liHtml += '<li>' + fieldNames[i] +':'+ result[i] +'</li>';
							}							
						}else if(properties){
							for(var i = 0;i<properties.length;i++){
								if(i>5){
									continue;
								}
								liHtml += '<li>' + properties[i].name +':'+ properties[i].value +'</li>';
							}	
						}

						$(".shopping_success_item h6").text(result.description);
						$(".shopping_success_item .pro_index ul").html(liHtml);
						$(".shopping_success_item .shopping_success_price strong").text("￥"+result.price);
						$(".shopping_success_item img").attr({"src":imageBaseUrl + result.medias[0].content});
					}
				}else{
					$.alert(errorInfo);
				}
			}
			common.queryCommonHead();
		},function(data){
			$.alert("商品信息查询失败");
		});
	}

	function queryCart(){
		var url = "/api/mall/cart/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						$(".shopping_table .shopping_list>ul").empty();
						for(key in result){
							if(result[key]){
								getProductInfo(result[key].productCode,result[key].num,result[key].skuCode);
							}
							
						}
						$(".shopping_table").show();
					}
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("查询购物车列表失败");
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
						var listHtml = "";
						listHtml += '<li>';
						listHtml += '<div class="shopping_item_wrap"><div class="shopping_checked">';
						listHtml += '<input type="checkbox" name="shopping_c" id="pro01" data-pdCode = "'+  code1 +'" data-skuCode="'+ code2 +'"/>';
						listHtml += '<label for="pro01">选择</label></div>';
						listHtml += '<div class="clearfix shopping_item"><div class="fl w590 pro_item">';
						listHtml += '<i class="pro_img"><img src="'+ imageBaseUrl + result.medias[0].content +'"/></i>';
						listHtml += '<div class="pro_info"><h6>'+ result.description +'</h6>';
						listHtml += '<div class="pro_index"><ul class="clearfix">';

						var fieldNames = result.fieldNames;
						var properties = result.properties;
						if(fieldNames){
							for(i in fieldNames){
								listHtml += '<li>' + fieldNames[i] +':'+ result[i] +'</li>';
							}							
						}else if(properties){
							for(var i = 0;i<properties.length;i++){
								if(i>5){
									continue;
								}
								listHtml += '<li>' + properties[i].name +':'+ properties[i].value +'</li>';
							}	
						}

						// listHtml += '<li>品牌：米其林</li>';
						// listHtml += '<li>速度级别：V</li>';
						// listHtml += '<li>毛重：9.8kg</li>';
						// listHtml += '<li>负荷指数：91</li>';
						// listHtml += '<li class="pro_eval_index">';
						// listHtml += '<i></i><i></i><i></i><i></i><i></i><span class="fc_red">5.0</span></li>';
						// listHtml += '<li>类型：四季通用</li>';
						listHtml += '</ul></div></div></div>';
						listHtml += '<div class="w140 fl tc"><strong class="product_price">￥'+result.price +'</strong></div>';
						listHtml += '<div class="w170 fl">';
						listHtml += '<span class="shopping_num">';
						listHtml += '<input type="text" value="'+ num +'" />';
						listHtml += '<i class="icon_minus less">-</i>';
						listHtml += '<i class="icon_plus">+</i>';
						listHtml += '</span></div>';
						listHtml += '<div class="w140 fl tc"><strong class="fc_red total_noney">￥'+Number(result.price)*Number(num) +'</strong></div>';
						listHtml += '<div class="w140 fl">';
						listHtml += '<a href="javascript:void(0);" class="delete">删除</a>';
						listHtml += '</div></div></div></li>';
						$(".shopping_table .shopping_list>ul").append(listHtml);
					}   
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("查询购物车商品信息失败");
		});
	}

	function calcMoney(ele,that){
		if("i" == ele){
			var num = Number($(that).siblings("input").val());
		}else{
			var num = Number($(that).val());
		}
		var price = $(that).parents(".shopping_item_wrap").find(".product_price").text();
		price = price.replace("￥","");
		$(that).parents(".shopping_item_wrap").find(".total_noney").text("￥" + Number(price)*num);
	}

	function totalMoney(){
		var num = 0;
		var money = 0;
		$(".shopping_item_wrap .shopping_checked input").each(function(){
			if($(this).is(":checked")){
				var inputNum = $(this).parents(".shopping_item_wrap").find(".shopping_num input").val();
				var totalMoney = $(this).parents(".shopping_item_wrap").find(".total_noney").text();
				totalMoney = totalMoney.replace("￥","");
				num += Number(inputNum);
				money += Number(totalMoney);				
			}
		});
		$(".shopping_summary strong:eq(0)").text(num);
		$(".shopping_summary strong:eq(1)").text("￥"+money);
	}


    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});