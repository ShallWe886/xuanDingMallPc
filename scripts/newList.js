define(function (require, exports, module) {
	var common = require("scripts/common");
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){

	}

	function init(){
		common.queryCommonHead();
		getType();
	}

	function getType(){
		var param = $.getPageParam();
		var type = param.type;
		$(".header_menu a").removeClass("active");
		if("0" == type){
			$(".header_menu li:eq(2) a").addClass("active");
		}else if("1" == type){
			$(".header_menu li:eq(3) a").addClass("active");
		}else{
			type = "2";
			$(".header_menu li:eq(1) a").addClass("active");
		}
		queryNews(type);
	}

	function queryNews(type,page){
		var url = "/api/common/article/list";
		var paraMap = {
			"type":type,
			"pageSize":"8",
			"pageNum":page
		}
		$(".pro_page ul").html("");
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var elehtml = "";
						var list = result.list;
						if(list.length >0){
							for(var i = 0;i<list.length;i++){
								elehtml += '<li>';						
								elehtml += '<a href="./newDetail.html?type='+ list[i].type +'&id='+ list[i].id +'">';
								elehtml += '<div class="content">';
								elehtml += '<h3>'+ list[i].title +'</h3>';
								elehtml += '<div class="info">'+ list[i].subhead +'</div>';
								elehtml += '</div>';
								elehtml += '<div class="pic">';
								elehtml += '<img src="'+ imageBaseUrl + list[i].imageUrl +'" width="345" height="150" />';
								elehtml += '</div>';
								elehtml += '</a>';
								elehtml += '</li>';
							}
							$(".order_address_wrap .address_list ul").html(elehtml);
							setPageNum(result.pageNum,result.pageSize,result.total,type);							
						}

					}
				}
			}
		})
	}

	function setPageNum(pageNum,pageSize,totalNum,type){
		// totalNum = 101;
		var totalPage = Math.ceil(Number(totalNum)/Number(pageSize));
		var elehtml = "";

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
		$(".pro_page ul").html(elehtml);

		$.bindEvent(".pro_page ul .plr8",function(e){
 			var page = $(this).attr("data-page");
 			getQueryString(type,page);
 			e.stopPropagation();
		},"click");

		$.bindEvent("#pageValue",function(e){
			var val = $(this).val();
 			if(val > totalPage){
 				val = totalPage;
 			}
 			$(this).val(val);
 			getQueryString(type,val);
 			e.stopPropagation();
		},"blur");

		$.bindEvent(".pro_page ul li a:not('.plr8')",function(e){
 			var page = $(this).text();
 			getQueryString(type,page);
 			e.stopPropagation();
		},"click");
	}

	function getQueryString(type,page){
		var index = $(".header_menu li a.active").parent().index();
		var type = "";
		// 0 公告 1汽修常识 2活动
		if(index == 1){
			type = "2";
		}else if(index == 2){
			type = "0";
		}else if(index == 3){
			type = "1";				
		}else{
			return;
		}
		queryNews(type,page);
	}

	function bindPageEvent(){
		$.bindEvent(".header_menu li",function(e){
			var index = $(this).index();
			var type = "";
			// 0 公告 1汽修常识 2活动
			if(index == 1){
				type = "2";
			}else if(index == 2){
				type = "0";
			}else if(index == 3){
				type = "1";				
			}else{
				return;
			}
			$(".header_menu li a").removeClass("active");
			$(this).find("a").addClass("active");
			queryNews(type)
			e.stopPropagation();
		},"click")
	}

	function destory(){

	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});