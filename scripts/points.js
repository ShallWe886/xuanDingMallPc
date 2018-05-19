define(function (require, exports, module) {
	var imageBaseUrl = "";
	var common = require("scripts/common");


	function before(){

	}

	function init(){
		queryList();
	}

	function queryList(){
		var url = "/api/pay/account/log/list";
		var paraMap = {
			
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result && result.length > 0){

					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			// layer.alert("");
		});
	}

	function bindPageEvent(){

		$.bindEvent(".update",function(e){
			$.prompt({
			  formType: 0,
			  value: '请输入积分数量',
			  title: '请输入需要充值的积分数量'
			},function(value, index){
				checkInput(value)
				$.close(index);
			});
			e.stopPropagation();
		},"click")
	}

	function checkInput(num){
		if(!$.isNumber(num)){
			$.layer("请输入正确的积分数量");
			return;
		}
		goToLogin(num);
	}

	function goToLogin(){
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

					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			// layer.alert("");
		});
	}

	function destory(num){

	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});