define(function (require, exports, module) {
	var common = require("scripts/common");

	function before(){

	}

	function init(){
		common.queryCommonHead();
		queryHistory();
	}


	function bindPageEvent(){

	}

	function destory(){

	}

	function queryHistory(){
		var url = "/api/common/client/referee/list";
		var paraMap = {

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
							eleHtml += '<tr>';
							eleHtml += '<td>'+ result[i].refereeDate +'</td>';
							eleHtml += '<td>'+ result[i].mobileNo +'</td>';
							eleHtml += '<td>'+ result[i].userName +'</td>';
							eleHtml += '<tr>';
						}
						$(".order_center_content .order_invite_wrap tr").append(eleHtml);
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