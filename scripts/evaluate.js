define(function (require, exports, module) {
	var common = require("scripts/common");
	var a = require("scripts/configuration");
	var imageBaseUrl = "";
	if(a){
		imageBaseUrl = a.imgBase;
	}
	var id = "";

	function before(){

	}

	function init(){
		id = $.getPageParam("id");
		common.queryCommonHead();
		queryOrder();
	}


	function bindPageEvent(){
		$.bindEvent(".submit_box a",function(e){
			checkSubmit();
			e.stopPropagation();
		},"click");
	}

	function destory(){

	}

	function queryOrder(){
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
						// var result = result[4];
						var eleHtml = "";
						console.log(result);
						for(var j = 0;j<result.length;j++){
							if(result[j].id != id){
								continue;
							}
							item = result[j].orderItemList;
							for(var i = 0;i<item.length;i++){

								if(item[i].commentState == "0"){

									eleHtml += '<div class="eve_list">';
									eleHtml += '<div class="address_list">';
									eleHtml += '<ul>';
									eleHtml += '<li>';
									eleHtml += '<div class="pic_box">';
									eleHtml += '<img src="'+ imageBaseUrl + item[i].pic +'"/>';
									eleHtml += '<p>'+ item[i].productName +'</p>';
									eleHtml += '<span>'+ item[i].price + " X " + item[i].category +'</span>';
									eleHtml += '</div>';
									eleHtml += '<div class="score_box" data-itemId="'+ item[i].id +'">';
									eleHtml += '<div class="score">';
									eleHtml += '<span class="title">商品评分</span>';
									eleHtml += '<p><i></i><i></i><i></i><i></i><i></i>';
									eleHtml += '</p>';
									eleHtml += '<span class="grade"></span>';
									eleHtml += '</div>';
									eleHtml += '<div class="score">';
									eleHtml += '<span class="title">评价晒单</span>';
									eleHtml += '<div class="textarea" contenteditable="true"></div>';
									eleHtml += '</div>';
									eleHtml += '<div class="upload">';
									// eleHtml += '<span class="small_pic"><img src="../images/img/tyre.jpg"></span>';
									eleHtml += '<div class="upload_box">';
									eleHtml += '<span class="add">上传图片</span>';
									eleHtml += '<form id="uploadForm" enctype="multipart/form-data">'; 
									eleHtml += '<input id="upload" name="file" type="file" multiple accept="image/*"/>';
									eleHtml += '</form>';
									eleHtml += '</div>';

									eleHtml += '</div>';
									eleHtml += '</div>';
									eleHtml += '</li>';
									eleHtml += '</ul>';
									eleHtml += '</div>';
									eleHtml += '</div>';
								}else{
									continue;
								}
							}						
						}


						$(".evaluate_content").prepend(eleHtml);
						$.bindEvent(".evaluate_content ul li .score_box i",function(e){
							var index = $(this).index();
							$(this).parents(".score_box").find("i").removeClass("active");
							var indexAdd = index + 1;
							 for(var i = 0;i<indexAdd;i++){
								// $(".score_box i:eq('"+ i +"')").addClass("active");
								$(this).parents(".score_box").find("i:eq('"+ i +"')").addClass("active");
							 }
							 $(this).parents(".eve_list").find(".grade").text(indexAdd + "分");
							 $(this).parents(".eve_list").data("grade",indexAdd);
							e.stopPropagation();
						},"click")

						$.bindEvent(".evaluate_content input",function(e){
							var input = $(this).parent()[0];
							uploadPic(input,this);
							e.stopPropagation();
						},"change")
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("查询订单失败");
		});
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
					$(_this).parents(".upload_box").before(eleHtml);	    		
		    	}
		    },  
		    error: function (err) {
		    	console.log(err);
		    }  
		});
	}

	function checkSubmit(){
		$(".score_box").each(function(){
			var itemId = $(this).attr("data-itemId");
			var images = [];
			$(this).find(".small_pic").each(function(){
				images.push($(this).attr("data-src"));
			})
			var mark = $(this).find(".grade").text();
			if(mark){
				mark = mark.replace("分","");
			}
			var content = $(this).find(".textarea").text();
			if(id && itemId && mark && content){
				uploadPj(id,itemId,mark,content,images)
			}
		})
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