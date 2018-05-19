define(function (require, exports, module) {

	function before(){

	}

	function init(){
		reset();
	}

	function reset(){
	  if (window.history && window.history.pushState) {
	    // $(window).on('popstate', function() {
	    // 	window.location.href = "./index.html";
	    // });
	     window.onpopstate = function(){
	    	window.location.href = "./index.html";
	     }	
		 window.history.pushState('forward', null, '#'); 
		 window.history.forward(1);
	  }
	}

	function bindPageEvent(){
		$.bindEvent("#next_btn",function(){
			var user_code = $("#user_code").val();
			if(!user_code){
				$.alert("用户名不能为空");
				return;
			}
			var password = $("#password").val();
			if(!password){
				$.alert("密码不能为空");
				return;
			}
			if(!$.isPwd(password)){
				$.alert("密码必须为包含数字,字母的6到12位字符");
				return;
			}
			login();
		},"click");
	}

	function destory(){

	}

	function login(){
		var url = "/api/common/client/login";
		var paraMap = {
			"loginId":$("#user_code").val(),
			"password":$("#password").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						$.setSStorage("logintstate","1");
						$.setSStorage("userInfo",JSON.stringify(result));
						var backPage = document.referrer;
						var loginPage = "";
						if(backPage && backPage.indexOf("register") < 0 && backPage.indexOf("login") < 0 && backPage.indexOf("lost") < 0){
							loginPage = backPage;
						}else{
							loginPage = "./index.html";
						}
						// $.alert("恭喜您登录成功",function(){
						// 	// window.location.href = loginPage;	
						// })
						$.msg("恭喜您登录成功",{
							"time":2000
						})
						window.setTimeout(function(){
							window.location.href = loginPage;	
						},2500)
					}
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("用户名或密码错误");
		});
	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});