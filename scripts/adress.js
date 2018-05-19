define(function (require, exports, module) {
	var common = require("scripts/common");
	var isComple = false;
	var changeResult = {};
	var localCity = JSON.parse($.getSStorageInfo("localCity"));
	var map = {};

	window.setTimeout(function(){
		map = new AMap.Map('map', {
		        resizeEnable: true,
		        zoom:15,
		        center: [113.870168,22.5703]
		});
		AMap.plugin(['AMap.ToolBar'],function(){
		        map.addControl(new AMap.ToolBar());
		})

	    AMap.plugin('AMap.Geocoder',function(){
	        var geocoder = new AMap.Geocoder({
	            city: ""//城市，默认：“全国”
	        });
	        var marker = new AMap.Marker({
	            map:map,
	            bubble:true
	        })
	        var select = $(".store_dialog select");
	        select.on("change",function(e){
	        	var address = $("option:selected").text();
	        	// if("请选择" == address){
	        	// 	return;
	        	// }
	        	geocoder.getLocation(address,function(status,result){
	              if(status=='complete'&&result.geocodes.length){
	                marker.setPosition(result.geocodes[0].location);
	                map.setCenter(marker.getPosition())
	              }
	            })
	        	e.stopPropagation();
	        })
	    });
	},1000);

	function before(){
		
	}

	function init(){
		/* 查询用户已经添加的地址 */
		queryAdress();
		common.queryCommonHead();
	}

	function bindPageEvent(){
		/* 增加地址 */
		$.bindEvent($("#addAdress"),function(e){
			$(".address_dialog_mask,.address_dialog").show();
			$(".address_dialog").data("type","1");// 0 无状态  1 增加地址 2 修改地址
			$("#default").prop("checked",true);
			queryDivision();
			e.stopPropagation();
		},"click");

		/* 增加汽配城地址 */
		$.bindEvent($("#addFactory"),function(e){
			$(".store_dialog_mask,.store_dialog").show();
			queryFactoryList();
			queryDivisionAlert();
			// $(".address_dialog").data("type","1");// 0 无状态  1 增加地址 2 修改地址
			// $("#default").prop("checked",true);
			// queryDivision();
			e.stopPropagation();
		},"click");

		/* 点击搜索查询汽配城地址 */
		$.bindEvent($(".store_address .header_search a"),function(e){
			queryFactoryList();
			e.stopPropagation();
		},"click");

		/* 测试事件 */
		$.preBindEvent($(".store_address_list"),"li",function(e){
			var arr = [];
			var ip = $(this).attr("data-ip");
			if(ip){
				arr = ip.split(",");
			}
			map.setCenter(arr);
			var _this = this;
			$.confirm("是否加该配送厂地址添加至收货地址",function(index){
				addToFactory(_this);
				$.close(index);
			})
			e.stopPropagation();
		},"click");

		/* 关闭汽配城弹窗 */
		$.bindEvent($(".dialog_close"),function(e){
			$(".store_dialog_mask,.store_dialog").hide();
			e.stopPropagation();
		},"click");

		/* 关闭弹窗 */
		$.bindEvent($("#close_btn"),function(e){
			$(".address_dialog_mask,.address_dialog").hide();
			$(".address_dialog input").val("");
			$(".address_dialog").data("type","0");
			e.stopPropagation();
		},"click");

		/* 提交地址表单 */
		$.bindEvent($("#saveAdress"),function(e){
			checkForm();
			e.stopPropagation();
		},"click");

		/* 自动填充地址别名 */
		$.bindEvent($(".nickAdress a"),function(e){
			$(this).siblings("input").val($(this).text());
			e.stopPropagation();
		},"click");

		/* 省级联动 */
		$.bindEvent($("#province"),function(e){
			queryDivision("province");
			e.stopPropagation();
		},"change");

		/* 市级联动 */
		$.bindEvent($("#city"),function(e){
			queryDivision("city");
			e.stopPropagation();
		},"change");

		/* 省级联动 */
		$.bindEvent($("#provinceAlert"),function(e){
			queryDivisionAlert("province");
			e.stopPropagation();
		},"change");

		/* 市级联动 */
		$.bindEvent($("#cityAlert"),function(e){
			queryDivisionAlert("city");
			e.stopPropagation();
		},"change");

		/* 删除已经添加的地址 */
		$.preBindEvent($(".address_list"),"#daleteAdress",function(e){
			var deleteId = $(this).attr("data-id"); 
			deleteAdress(deleteId);
			e.stopPropagation();
		},"click");

		/* 修改已经添加的地址 */
		$.preBindEvent($(".address_list"),"#updateAdress",function(e){
			changeResult = JSON.parse($(this).parents(".address_item").attr("data-results"));
			$(".address_dialog_mask,.address_dialog").show();
			$(".address_dialog").data("type","2");// 0 无状态  1 增加地址 2 修改地址
			//填充表单
			compleForm();
			e.stopPropagation();
		},"click");
	}

	function destory(){

	}

	function addToFactory(_this){
		var name = $(_this).attr("data-name");
		var position = $(_this).attr("data-position");
		var tel = $(_this).attr("data-tel");
		var adress = $(_this).attr("data-adress");
		if(position){
			position = position.split(",");
		}
		if(position && position.length == 3){
			var province = position[0];
			var city = position[1];
			var region = position[2];
		}
		var url = "/api/common/client/address/add";
		var paraMap = {
			"name":name,
			"tel":tel,
			"remark":"汽配厂",
			"province":province,
			"city":city,
			"region":region,
			"address":adress,
			"setDefault":"",
			"zipCode":"000000"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						queryAdress();
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("新增地址失败");
		});
	}

	function compleForm(){
		isComple = true;
		queryDivision();
		$("#userName").val(changeResult.name);
		$("#mobile").val(changeResult.tel);
		$("#nickAdress").val(changeResult.remark);
		$("#province option").val(changeResult.province);
		$("#city option").val(changeResult.city);
		$("#region option").val(changeResult.region);
		$("#inputAdress").val(changeResult.address);
		$("#eamil").val(changeResult.email);
		if(changeResult.default != 1){
			$("#default").prop("checked",false);
		}else{
			$("#default").prop("checked",true);
		}
	}

	function checkForm(){
		var userName = $("#userName").val();
		if(!userName){
			layer.alert("收货人不能为空");
			return;
		}
		var mobile = $("#mobile").val();
		if(!mobile){
			layer.alert("手机号码不能为空");
			return;
		}
		if(!$.isMobile(mobile)){
			layer.alert("手机号码格式不正确");
			return;
		}
		var province = $("#province option:selected").val();
		if(!province){
			layer.alert("请选择所在省份");
			return;
		}
		var city = $("#city option:selected").val();
		if(!city){
			layer.alert("请选择所在城市");
			return;
		}
		var region = $("#region option:selected").val();
		if(!region){
			layer.alert("请选择所在县/区");
			return;
		}
		var address = $("#inputAdress").val();
		if(!address){
			layer.alert("详细地址不能为空");
			return;
		}
		var data = $(".address_dialog").data();
		if(data && "1" == data.type){
			saveAdress();
		}else if(data && "2" == data.type){
			updateAdress();		
		}
	}

	function queryFactoryList(){
		var url = "/api/mall/store/list";
		var paraMap = {
			"name":$("#storeName").val(),
			"province":$("#provinceAlert option:selected").val(),
			"city":$("#cityAlert option:selected").val(),
			"region":$("#regionAlert option:selected").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					var eleHtml = "";
					if(result){
						if(result.length>0){
							for(var i = 0;i<result.length;i++){
								if(localCity){
									province = localCity[result[i].province].regionName;
									city = localCity[result[i].city].regionName;
									region = localCity[result[i].region].regionName;
								}
								eleHtml += '<li data-tel="'+ result[i].tel +'"  data-adress="'+ province + city + region + result[i].address +'"  data-name="'+ result[i].name +'" data-position="'+ result[i].province +","+ result[i].city +","+ result[i].region +'" data-ip="'+  result[i].longitude+","+ result[i].latitude +'">'; 
								eleHtml += '<div class="store_address_item">';
								eleHtml += '<h6 class="factoryName"><i></i>'+ result[i].name +'</h6>';
								eleHtml += '<p>地址：'+ province + city + region + result[i].address +'</p>';
								eleHtml += '<div class="clearfix">';
								// eleHtml += '<span class="fc_red">好评率：98%</span>';
								eleHtml += '<span>电话：'+ result[i].tel +'</span>';
								eleHtml += '</div></div></li>';
							}	
						}
					}
					$(".store_address_list").html(eleHtml);
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询门店列表失败");
		});
	}

	function updateAdress(){
		var url = "/api/common/client/address/update";
		var paraMap = {
			"addressId":changeResult.id+"",
			"name":$("#userName").val(),
			"tel":$("#mobile").val(),
			"remark":$("#nickAdress").val(),
			"province":$("#province option:selected").val(),
			"city":$("#city option:selected").val(),
			"region":$("#region option:selected").val(),
			"address":$("#inputAdress").val(),
			"setDefault":$("#default").is(":checked")?"1":"",
			"zipCode":"000000",
			"type":"1"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						$(".address_dialog_mask,.address_dialog").hide();
						$(".address_dialog input").val("");
						queryAdress();
						// $(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
					}
				}else{
					layer.alert(errorInfo);
					// $(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
				}
			}
		},function(data){
			layer.alert("新增地址失败");
			$(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
		});
	}

	function saveAdress(){
		var url = "/api/common/client/address/add";
		var paraMap = {
			"name":$("#userName").val(),
			"tel":$("#mobile").val(),
			"remark":$("#nickAdress").val(),
			"province":$("#province option:selected").val(),
			"city":$("#city option:selected").val(),
			"region":$("#region option:selected").val(),
			"address":$("#inputAdress").val(),
			"setDefault":$("#default").is(":checked")?"1":"",
			"zipCode":"000000",
			"type":"1"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						// layer.alert(result);
						$(".address_dialog_mask,.address_dialog").hide();
						$(".address_dialog input").val("");
						queryAdress();
						$(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
					}
				}else{
					layer.alert(errorInfo);
					// $(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
				}
			}
		},function(data){
			layer.alert("新增地址失败");
			// $(".address_dialog").data("type","0");// 0 无状态  1 增加地址 2 修改地址
		});
	}

	/* 查询用户已经添加的地址 */
	function queryAdress(){
		var url = "/api/common/client/address/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var results = data.result;
					if(results){
						var eleHtml = '';
						for (var i = 0; i < results.length; i++) {
							var province = "";
							var city = "";
							var region = "";
							eleHtml += '<li><div class="address_item" data-results='+ JSON.stringify(results[i]) +'><h6 class="clearfix"><i class="fl"></i>';
							eleHtml += '<span class="fl fc_gray6">'+results[i].remark+'</span><a class="fr" href="javascript:void(0);" id="daleteAdress" data-id="'+ results[i].id +'">删除</a>';
							eleHtml += '<a class="fr" href="javascript:void(0);" id="updateAdress" data-id="'+ results[i].id +'" style="padding-right:10px;">编辑</a></h6>';
							eleHtml += '<div class="address_item_info"><p><span>'+results[i].name+'</span><span>'+results[i].tel+'</span></p>';
							if(localCity){
								province = localCity[results[i].province].regionName;
								city = localCity[results[i].city].regionName;
								region = localCity[results[i].region].regionName;
							}
							eleHtml += '<p>'+province + city + region +'</p>';
							eleHtml += '<p>'+results[i].address+'</p></div></div></li>';
						}
						$(".address_list ul").html(eleHtml);
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询用户地址失败");
		});
	}

	function deleteAdress(deleteId){
		var url = "/api/common/client/address/delete";
		var paraMap = {
			"addressId":deleteId
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					queryAdress();
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询用户地址失败");
		});
	}

	/* 省市区三级联动 */
	function queryDivision(type){
		var url = "/api/common/administrative/division/get";
		var province = $("#province option:selected").val();
		var city = $("#city option:selected").val();
		var regionCode = "86";
		if("province" == type){
			if(!province){
				$("#city").empty().hide();
				$("#region").empty().hide();
				return;
			}
			regionCode = province;
		}else if("city" == type){
			if(!city){
				$("#region").empty().hide();
				return;
			}
 			regionCode = city;
		}else if(!type){
			regionCode = "86";
		}else{
			return;
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
						eleHtml += '<option value="">请选择</option>';
						for (var i = 0; i < result.length; i++) {
							eleHtml += '<option value="'+result[i].regionCode+'">'+result[i].regionName+'</option>';
						}
						if("province" == type){
							$("#city").html(eleHtml).show();
							$("#region").empty().hide();
							if(isComple){
								$("#city option[value='"+ changeResult.city +"'")[0].selected = true;
								queryDivision("city");
							}
						}else if("city" == type){
							$("#region").html(eleHtml).show();
							if(isComple){
								isComple = false;
								$("#region option[value='"+ changeResult.region +"'")[0].selected = true;
							}
						}else if(!type){
							$("#province").html(eleHtml);
							$("#city").empty().hide();
							$("#region").empty().hide();
							if(isComple){
								$("#province option[value='"+ changeResult.province +"'")[0].selected = true;
								queryDivision("province");
							}
						}else{
							return;
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

	/* 省市区三级联动 */
	function queryDivisionAlert(type){
		var url = "/api/common/administrative/division/get";
		var province = $("#provinceAlert option:selected").val();
		var city = $("#cityAlert option:selected").val();
		var regionCode = "86";
		if("province" == type){
			if(!province){
				$("#cityAlert").empty().hide();
				$("#regionAlert").empty().hide();
				return;
			}
			regionCode = province;
		}else if("city" == type){
			if(!city){
				$("#regionAlert").empty().hide();
				return;
			}
 			regionCode = city;
		}else if(!type){
			regionCode = "86";
		}else{
			return;
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
						eleHtml += '<option value="">请选择</option>';
						for (var i = 0; i < result.length; i++) {
							eleHtml += '<option value="'+result[i].regionCode+'">'+result[i].regionName+'</option>';
						}
						if("province" == type){
							$("#cityAlert").html(eleHtml).show();
							$("#regionAlert").empty().hide();
							if(isComple){
								$("#cityAlert option[value='"+ changeResult.city +"'")[0].selected = true;
								queryDivision("city");
							}
						}else if("city" == type){
							$("#regionAlert").html(eleHtml).show();
							if(isComple){
								isComple = false;
								$("#regionAlert option[value='"+ changeResult.region +"'")[0].selected = true;
							}
						}else if(!type){
							$("#provinceAlert").html(eleHtml);
							$("#cityAlert").empty().hide();
							$("#regionAlert").empty().hide();
							if(isComple){
								$("#provinceAlert option[value='"+ changeResult.province +"'")[0].selected = true;
								queryDivision("province");
							}
						}else{
							return;
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


    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});