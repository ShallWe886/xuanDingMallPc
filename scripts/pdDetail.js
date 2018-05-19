define(function (require, exports, module) {
	var common = require("scripts/common");
	var productInfo = "";
	var a = require("scripts/configuration");
	var code = "";
	var isPreView = "";
	var change = false;//是否是积分商品
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){

	}
               
	function init(){
		code = getProductCode();
		isPreView = getYl() || "";
		queryProductInfo(code);
		queryHistory(code);
		common.queryCommonHead();
		// queryLike();
		// queryPj();
		begin();
		getBanner();
	}

	function bindPageEvent(){


		/* sku属性选择 */
		$.preBindEvent(".goods_top_param_service",".sku_product",function(e){ 
			$(this).parent().find("i").removeClass("active");
			$(this).find("i").addClass("active");
			e.stopPropagation();
		},"click")

		/* 数量输入 */
		$.bindEvent(".shopping_num input",function(e){
			$(this).val($(this).val().replace(/[^0-9]/ig,"").replace(/\b(0+)/gi,""));
			if("" == $(this).val()){
				$(this).val(1);
			}
			e.stopPropagation();
		},"input")

		/* 数量增减 */
		$.bindEvent(".shopping_num i",function(e){
			var val = $(".shopping_num input").val();
			var amount = Number(val);
			if($(this).hasClass("less")){
				amount <=1 ?1:amount--;
			}else{
				amount++;
			}
			$(".shopping_num input").val(amount);
			e.stopPropagation();
		},"click")

		$.bindEvent(".goods_area_btn",function(e){
			$(".goods_area").show();
			if(!$(this).attr("data-code")){
				queryDivision("province");			
			}
			e.stopPropagation();
		},"click");

		$.preBindEvent(".goods_area_options ul","li",function(e){
			var a = $(this).parent().index();
			var code = $(this).find("a").attr("data-code");
			var name = $(this).text();
			$(".goods_area_select li em").removeClass("active");
			$("#getSelect em").addClass("active");
			if(a == 0){
				$(".goods_area_select .province").attr({"data-code":code}).show().find("em").text(name);
				queryDivision("city");
			}else if(a == 1){
				$(".goods_area_select .city").attr({"data-code":code}).show().find("em").text(name);
				queryDivision("region");
			}else if(a == 2){
				$(".goods_area_select .region").attr({"data-code":code}).show().find("em").text(name);
				$("#getSelect").hide();
				$(".goods_area_select .region em").addClass("active");
				$(".goods_area_select i").click();
			}
			e.stopPropagation();
		},"click");

		$.bindEvent(".goods_area_select i",function(e){
			var code = "";
			var name = "";
			$(".goods_area_select li").each(function(){
				if($(this).attr("data-code")){
					code += "|" + $(this).attr("data-code");
					name += $(this).text();
				}
			});
			$(".goods_area_btn").html(name+"<i></i>").attr({"data-code":code});
			$(".goods_area").hide();
			e.stopPropagation();
		},"click");

		$.bindEvent(".ask_question",function(e){
			$("#nb_icon_wrap").click();
			e.stopPropagation();
		},"click")


		$.bindEvent("#addCart",function(e){
			addCart();
			e.stopPropagation();
		},"click");

		$.bindEvent("#quickBuy",function(e){
			var productCode = productInfo.code;
			goToConfirm(productCode);
			e.stopPropagation();
		},"click");

		$.bindEvent(".goods_classified ul li",function(e){
			var index = $(this).index();
			$(".change").hide();
			$(".change:eq("+ index +")").show();
			if(index  == 2){
				queryPj();
			}
			e.stopPropagation();
		},"click");

		$.preBindEvent(".goods_area_select","li",function(e){
			var index = $(this).index();
			if("getSelect" == $(this).attr("id")){
				return;
			}
			$(".goods_area_select li em").removeClass("active");
			$(this).find("em").addClass("active");
			$(".goods_area_options ul").hide();
			$(".goods_area_options ul:eq("+ index +")").show();
			e.stopPropagation();
		},"click");
	}

	function getBanner() {
		var url = "/api/common/main/image/list";
		var paraMap = {
			"type":"9"
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
					$(".goods_hot_wrap .goods_hot ul").html(eleHtml);
				}
			}
		});
	}

	function queryTop(q){
		var url = "/api/mall/product/list";
		if(q){
			q = "supportDiscount:0 && publishState:1 AND category:"+q
		}
		var paraMap = {
			"q": q || "supportDiscount:0 && publishState:1",
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
								if(i>1){
									continue;
								}
								var description = list[i].productDescription;
								if(description && description.length >16){
									description = description.substring(0,15);
								}
								elehtml += '<li>';
								elehtml += '<a class="list_pro xsqg_pro" href="./pdDetail.html?productCode='+ list[i].productCode +'">';
								elehtml += '<h6>'+ description +'</h6>';
								elehtml += '<span><img src="'+ imageBaseUrl + list[i].pic +'"/></span>';
								elehtml += '<p>';
								// elehtml += '<em>抢购价￥'+ list[i].price +'</em>';
								elehtml += '<em>价格￥'+ list[i].price + '</em>';
								elehtml += '</p>';
								// elehtml += '<i></i>';
								elehtml += '</a>';
								elehtml += '</li>';

							}
							$(".like ul").html(elehtml);
						}
					}
				}
			}
		})
	}

	function destory(){

	}

	function queryPj(page){
		var url = "/api/mall/product/comment/list";
		var paraMap = {
			"productCode":code
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
								elehtml += drawPjHtml(list[i]);
							}
							setPageNum(result.pageNum,result.pageSize,result.total);
							$(".pro_page").show();
						}else{
							$(".pro_page").hide();
						}
						$(".goods_comment .comment_wrap .comment_list").html(elehtml);
						
					}
				}
			}
		})		
	}

	function drawPjHtml(item){
		var userName = item.userName;
		if(userName){
			userName = userName.substring(0,1)+"***";

		}
		var score = Number(item.mark) || 0;
		var description = item.content;
		if(description){
			description = description.length>150?description.substring(0,149):description;
		}
		var medias = item.images || [];
		var time = item.replyTime;
		var append = item.reply;
		var userPic = item.head;
		var elehtml = "";
		elehtml += '<div class="comment_item">';
		elehtml += '<div class="comment_user_wrap">';
		elehtml += '<div class="comment_user">';
		elehtml += '<i><img src="' + userPic +'"/></i>';
		elehtml += '<span>'+ userName +'</span>';
		elehtml += '</div>';
		elehtml += '</div>';
		elehtml += '<div class="comment_content">';
		elehtml += '<div class="clearfix comment_content_star">';
		for(var i = 0;i<5;i++){
			if(score>=1){
				elehtml += '<i class="active"></i>';
			}else{
				elehtml += '<i></i>';
			}
			score --;
		}
		elehtml += '</div>';
		elehtml += '<div class="comment_content_text">';
		elehtml += '<p>'+ description +'</p>';
		elehtml += '</div>';
		elehtml += '<div class="comment_content_img">';
		elehtml += '<ul class="clearfix">';
		for(var j=0;j<medias.length;j++){
			if(j>7){
				continue;
			}
			elehtml += '<li><img src="'+ imageBaseUrl + medias[j].content +'"/></li>';
		}
		elehtml += '</ul>';
		elehtml += '</div>';
		elehtml += '<div class="clearfix comment_content_replenish">';
		elehtml += '<div class="fl comment_content_info">';
		// elehtml += '<span>经济耐用型</span>';
		// elehtml += '<span>耐驰客 TECHNO</span>';
		// elehtml += '<span>205/55R16</span>';
		elehtml += '<span>'+ $.formatDate(time) +'</span>';
		elehtml += '</div>';
		elehtml += '</div>';
		if(append){
			elehtml += '<div class="comment_append">';
			elehtml += '<span class="comment_append_time">[商家评论]</span>';
			elehtml += '<p class="comment_append_con">'+ append +'</p>';
			elehtml += '</div>';
		}

		elehtml += '</div>';
		elehtml += '</div>';
		return elehtml;
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

		$.bindEvent(".pro_page ul .plr8",function(e){
 			var page = $(this).attr("data-page");
 			queryPj(page);
 			e.stopPropagation();
		},"click");

		$.bindEvent("#pageValue",function(e){
			var val = $(this).val();
 			if(val > totalPage){
 				val = totalPage;    
 			}
 			$(this).val(val);
 			queryPj(val);
 			e.stopPropagation();
		},"input");

		$.bindEvent(".pro_page ul li a:not('.plr8')",function(e){
 			var page = $(this).text();
 			queryPj(page);
 			e.stopPropagation();
		},"click");
	}

	function addHistory(code){
		var url = "/api/mall/recent/product/add";
		var paraMap = {
			"productCode":code
		}
		$.invoke(url,paraMap,function(data){

		})
	}

	function queryHistory(code){
		var url = "/api/mall/recent/product/list";
		var paraMap = {
			"productCode":code
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
							eleHtml += '<a class="list_pro xsqg_pro" href="./pdDetail.html?productCode='+ result[i].productCode +'">';
							eleHtml += '<h6>'+ result[i].productName +'</h6>';
							eleHtml += '<span><img src="'+ imageBaseUrl + result[i].pic +'"/></span>';
							eleHtml += '<p>';
							eleHtml += '<em>价格￥'+ result[i].price +'</em>';
							eleHtml += '</p>';
							eleHtml += '</a>';
							eleHtml += '</li>';
						}
						$(".goods_top_recommand .xsqg_inner.history ul").html(eleHtml);
					}
				}
			}
		})
		addHistory(code);
	}

	function getProductCode(){
		var param = $.getPageParam();
		if(param && param.change == "1"){
			change = true;
		}
		if(param && param.productCode){
			return param.productCode
		}
	}

	function getYl(){
		var param = $.getPageParam();
		if(param && param.isPreView == "1"){
			return param.isPreView
		}
	}

	/* 省市区三级联动 */
	function queryDivision(code){
		var url = "/api/common/administrative/division/get";
		var regionCode = "86";
		switch(code){
			case "city":
				regionCode = $(".goods_area_select .province").attr("data-code");
				break;
			case "region":
				regionCode = $(".goods_area_select .city").attr("data-code");
				break;
			default: regionCode = "86";
		}
		var paraMap = {
			"parentRegionCode":regionCode
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var eleHtml = '';
						for (var i = 0; i < result.length; i++) {
							var name = result[i].regionName;
							if("86" == regionCode){
								if(name.indexOf("黑龙江") == 0){
									name = "黑龙江";
								}else{
									name = name.slice(0,2);
								}
							}
							eleHtml  += '<li><a href="javascript:void(0);" data-code = "'+ result[i].regionCode +'">'+ name +'</a></li>';
						}
						$(".goods_area_options ul").hide();
						$(".goods_area_select li").hide();
						switch(code){
							case "province":
								$(".goods_area_options ul.province").html(eleHtml).show();
								// $(".goods_area_select li.province").show();
								$(".goods_area_select li#getSelect").show();
								break;
							case "city":
								$(".goods_area_options ul.city").html(eleHtml).show();
								$(".goods_area_select li.province").show();
								// $(".goods_area_select li.city").show();
								$(".goods_area_select li#getSelect").show();
								break;
							default: $(".goods_area_options ul.region").html(eleHtml).show();
									 $(".goods_area_select li.province").show();
									 $(".goods_area_select li.city").show();
									 $(".goods_area_select li#getSelect").show();
									 // $(".goods_area_select li.region").show();
						}
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询用户地址失败");
		});
	}


	/* 查询商品信息 */
	function queryProductInfo(code){
		var url = "/api/mall/product/spu/get";
		var paraMap = {
			"productCode":code,
			"isPreView":isPreView
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						productInfo = result;
						if(productInfo){
							if(change){
								$(".changeChannel").show();
							}else if("1" == productInfo.category){
								$(".generalChannel").show();
							}else if("2" == productInfo.category){
								$(".tyreChannel").show();
								$(".noshow").show();
							}else{
								$(".partsChannel").show();
							}
							queryTop(productInfo.category)
						}
						drawProduct();
					}
				}else{
					$.alert(errorInfo,function(){
						if("-10000" == errorNo){
							window.location.href = "./index.html";
						}
					});
				}
			}
		},function(data){
			$.alert("查询商品信息失败,请稍后尝试");
		});
	}

	function drawProduct(){
		if(productInfo){
			var a = productInfo.description;
			a = a.length>50?a.substring(0,50):a;
			$(".goods_top_param #pdTitle").text(a);
			var properties = productInfo.properties;
			var skus = productInfo.skus || [];
			if(properties && properties.length >0){
				var liHtml = "";
				for(var i = 0;i<properties.length; i++){
					if(i >5){
						continue;
					}
					if("1" == properties[i].sku){
						// var skuCode = properties[i].productCode;
						// var field = properties[i].skuField;
						// var skuHtml = '<dl class="clearfix skus_type" data-fields="'+ field +'"><dt>'+ properties[i].name +'：</dt>';
						// var skusList = [];
						// 	for(var k = 0;k<skus.length;k++){
						// 		if(field){
						// 			if($.inArray(skus[k][field],skusList)<0){
						// 				skusList.push(skus[k][field]);
						// 				skuHtml += '<dd class="sku_product"><i data-field="'+ skus[k][field] +'" data-fields="'+ field +'" data-code="'+ skus[k].code +'">'+ skus[k][field] +'</i></dd>';
						// 			}
						// 		}
						// 	}
						// skuHtml += '</dl>';
						// $(".price_dl").after(skuHtml);
					}else{
						liHtml += '<li><span>'+ properties[i].name +'：</span>' + properties[i].value + '</li>';						
					}
				}
				$(".page_nav em").text(productInfo.name);
				$(".goods_top_param #properties ul").html(liHtml);
				function CheckVersion(detail) {
		            var o = document.getElementById("detail");
		            ed = document.all ? o.contentWindow.document : o.contentDocument;
		            ed.open();
		            ed.write(detail);
		            ed.close();
		            ed.contentEditable = false;
		            ed.designMode = 'off';
              	}
				CheckVersion(productInfo.detail || "");
				$("#detail").load(function () {
					var mainheight = $(this).contents().find("body").height() + 50;
					$(this).height(mainheight);
				});

				function CheckVersionSize(size) {
		            var o = document.getElementById("productSize");
		            ed = document.all ? o.contentWindow.document : o.contentDocument;
		            ed.open();
		            ed.write(size);
		            ed.close();
		            ed.contentEditable = false;
		            ed.designMode = 'off';
              	}
				CheckVersionSize(productInfo.brief || "");
				$("#productSize").load(function () {
					var mainheight = $(this).contents().find("body").height() + 50;
					$(this).height(mainheight);
				});
			}
			if(change){
				$(".goods_top_param #price").text(parseInt(productInfo.price)+"积分");
				$("#addCart").hide();
			}else{
				$(".goods_top_param #price").text("￥"+productInfo.price);
			}
			
			var medias = productInfo.medias;
			if(medias && medias.length>0){
				for(var j = 0;j<medias.length; j++){
					if(j >5){
						continue;
					}
					$(".goods_top_img_list ul li:eq("+ j +") img").attr({"src":imageBaseUrl + medias[j].content}).parents("li").show();
				}
			}
			$(".goods_top_img_list ul li:eq(0) i").click();
		}
	}

	function addCart(){
		var param = {};
		var flag = true;//属性是否一致
		// if(productInfo && productInfo.sku == "1"){
		// 	var skus = productInfo.skus;
		// 	$(".skus_type").each(function(){
		// 		var $active = $(this).find("i.active");
		// 		var skus_field = $(this).attr("data-fields");
		// 		var field = $active.attr("data-field");
		// 		var fields = $active.attr("data-fields");
		// 		var code = $active.attr("data-code");
		// 		if(field && fields){
		// 			param[fields] = field;
		// 		}else{
		// 			layer.alert("请选择您需要的规格");
		// 			flag = false;
		// 			return false;
		// 		}
		// 	})
		// 	if(flag && skus && skus.length >0){
		// 		for(var i = 0;i<skus.length;i++){
		// 			var flag1 = true;//判断是否继续执行
		// 			var skuMap = skus[i];
		// 			for(key in param){
		// 				if(skuMap[key] != param[key]){
		// 					flag1 = false;
		// 				}
		// 			}
		// 			if(flag1){
		// 				var productCode = skus[i].productCode;
		// 				var code = skus[i].code;
		// 				saveCart(productCode,code);
		// 				break;
		// 			}
		// 		}
		// 	}
		// }else if(productInfo){
			var productCode = productInfo.code;
			saveCart(productCode,"");
		// }
	}

	function saveCart(productCode,code){
		var url = "/api/mall/cart/add";
		var paraMap = {
			"num":$(".shopping_num input").val() + "",
			"productCode":productCode,
			"skuCode":code
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					window.location.href = "./cart.html?productCode="+productCode+"&skuCode="+code;
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("添加购物车失败");
		});
	}

	function goToConfirm(productCode,code){
		var arr = [];
		arr.push({"productCode":productCode,"skuCode":code,"number":$(".shopping_num input").val()+""});
		$.setSStorage("shopList",JSON.stringify(arr));
		if(change){
			window.location.href = "./confirm.html?change=1";
		}else{
			window.location.href = "./confirm.html";		
		}
		
	}


	//展示切换效果
	function begin(){
		var preIndexN , indexN;
		for (var i=0; i<$(".info_tit a").length;i++) {
			if ($(".info_tit a").eq(i).hasClass("active")) {
				indexN = i;
			}
		}
		$(".info_tit a").click(function(){
			if($(this).hasClass("disabled")){
				return false;
			}
			preIndexN = indexN;
			indexN = $(".info_tit a").index(this);
			$(".info_tit a").removeClass("active in reverse");
			$(this).addClass("active");
			if(preIndexN < indexN){
				$(this).addClass("reverse");
			}else{
				$(this).addClass("in");
			}
		});
		$(".goods_top_img_list i").click(function(){
			$(".goods_top_img_list i").removeClass("active");
			$(this).addClass("active");
			var imgSrc = $(this).children("img").attr("src");
			$(".e_zoom").children("img").attr({"src":imgSrc,"data-img-big":imgSrc});
		});
		imgEZoom();
	}

	/*
	 * 图片局部放大效果
	 * 按照6倍比例放大
	 * */
	function imgEZoom(){
		var e=arguments.callee.caller.arguments[0]||window.event;//消除浏览器差异
		var obj = $(".e_zoom");
		var imgZoom = obj.children("div"); //图片放大后放置容器
		var imgLump = obj.children("span"); //图片移动时浮动小方块
		var imgBig = imgZoom.children("img"); //放大之后的图片
		var imgLumpW = 140; //小方块的宽度
		var multi = 3; //放大倍数
		
		obj.mousemove(function(e){
			var thisImg = $(this).children("img"); //当前显示的图片
			var imgW = thisImg.width();
			var imgH = thisImg.height();
			
			// 设置放大图片的默认属性
			imgBig.css({"position":"absolute","width":imgW*3+"px","height":imgH*3+"px"});
			
			//鼠标位于当前图片中的坐标位置
			var x = e.clientX - thisImg.offset().left;
			var y = e.clientY - thisImg.offset().top;
			
			//计算放大区域（尺寸60*60）相对于父元素的偏移
			var lumpLeft = 0;
			var lumpTop = 0;
			if(x<=imgLumpW){//小于方块本身时
				lumpLeft = 0;
			}else if(x > (imgW-imgLumpW)){
				lumpLeft = imgW - imgLumpW;
			}else{
				lumpLeft = x - imgLumpW/2;
			}
			if(y<=imgLumpW){
				lumpTop = 0;
			}else if(y > (imgH-imgLumpW)){
				lumpTop = imgH - imgLumpW;
			}else{
				lumpTop = y - imgLumpW/2;
			}

			imgLump.show();//小方块显示
			imgLump.css({"width":imgLumpW+"px","height":imgLumpW+"px","left":lumpLeft+"px","top":lumpTop+"px"});
			
			var _src = thisImg.attr("data-img-big");//在原图中保存的大图的位置
			imgZoom.show(); //放大图片容器显示
			
			//根据鼠标相对于原图的偏移，计算放大图的偏移
	        var imgLeft = -1 * lumpLeft * multi;
	        var imgTop = -1 * lumpTop * multi;
	        imgBig.attr("src",_src); //放大图片添加位置
	        imgBig.css({"left":imgLeft+"px","top":imgTop+"px"});//设置图片位置
		});
		//鼠标移除之后
		obj.mouseleave(function(event){
			imgLump.hide(); //小方块隐藏
	        imgZoom.hide(); //放大图片容器隐藏
	    });
	}


    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});