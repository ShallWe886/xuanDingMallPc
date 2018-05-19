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
		var id = param.id;
		$(".header_menu a").removeClass("active");
		if("0" == type){
			$(".header_menu li:eq(2) a").addClass("active");
		}else if("1" == type){
			$(".header_menu li:eq(3) a").addClass("active");
		}else{
			type = "2";
			$(".header_menu li:eq(1) a").addClass("active");
		}
		queryNews(type,id);
	}

	function queryNews(type,id){
		var url = "/api/common/article/list";
		var paraMap = {
			"type":type,
			"pageSize":"1000"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var elehtml = "";
						var list = result.list;
						for(var i = 0;i<list.length;i++){
							if(list[i].id != id){
								continue;
							}else{
								$(".address_list .article .title").text(list[i].title);
								$(".address_list .article span:eq(0) strong").text("");
								$(".address_list .article span:eq(1) strong").text(list[i].author);
								$(".address_list .article span:eq(2) strong").text($.formatDate(list[i].publishTime));
								$("title").text(list[i].seoTitle);
								$("link").after('<META content="'+ list[i].seoDescription +'" name="description">');
								$("link").after('<META content="'+ list[i].seoKeyWords +'" name="keywords">');
								function CheckVersion(detail) {
						            var o = document.getElementById("detail");
						            ed = document.all ? o.contentWindow.document : o.contentDocument;
						            ed.open();
						            ed.write(detail);
						            ed.close();
						            ed.contentEditable = false;
						            ed.designMode = 'on';
				              	}
								CheckVersion(list[i].content || "");
							}
						}

					}
				}
			}
		})
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
			window.location.href = "./newList.html?type="+type;
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