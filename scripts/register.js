define(function (require, exports, module) {
	var TIME = 60;
	var count = TIME;
	var a = require("scripts/configuration");
	if(a){
		var imageBaseUrl = a.imgBase;
	}

	function before(){

	}

	function init(){

	}

	function bindPageEvent(){
		/*重新获取验证码*/
		$.bindEvent("#verifyCode",function(){
			getTiekct();
		},"click");

		/*点击获取手机验证码*/
		$.bindEvent("#mobile_btn",function(){
			if($(this).hasClass("disabled")){
				return;
			}
			var mobile = $("#mobile").val();
			if(!$.isMobile(mobile)){
				$.alert("手机号码格式不正确");
				return;
			}
			var ticket = $("#ticket").val();
			if(!ticket){
				$.alert("图形验证码不能为空");
				return;
			}
			getVerifyCode();//获取短信验证码
		},"click");

		/*手机号码输入框获得焦点*/
		$.bindEvent("#mobile",function(){
			var mobile = $(this).val();
			if(mobile && mobile.length == 11){
				getTiekct();
				$("#verifyLi").show();
			}
		},"focus");

		/*手机号码输入框输入监听*/
		$.bindEvent("#mobile",function(){
			var mobile = $(this).val();
			if(mobile && mobile.length == 11){
				getTiekct();
				$("#verifyLi").show();
			}
		},"input");
      
		/*手机号码输入框失去焦点*/
		$.bindEvent("#mobile",function(){
			var mobile = $(this).val();
			if(!mobile || mobile.length != 11){
				$("#verifyLi").hide();
			}
		},"blur");

		/*点击立即注册*/
		$.bindEvent("#mobile",function(){
			var mobile = $(this).val();
			if(mobile && mobile.length == 11){
				getTiekct();
				$("#verifyLi").show();
			}
		},"click");

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
			var mobile = $("#mobile").val();
			if(!$.isMobile(mobile)){
				$.alert("手机号码格式不正确");
				return;
			}
			var smsCode = $("#smsCode").val();
			if(!smsCode){
				$.alert("短信验证码不能为空");
				return;
			}
			submitUserInfo();
		},"click");
	}

	function destory(){

	}

	/*获取图形验证码*/
	function getTiekct(){
		var mobile = $("#mobile").val();
		if(!$.isMobile(mobile)){
			$.alert("手机号码格式不正确");
			return;
		}
		$("#verifyCode").attr({"src":imageBaseUrl + "/api/common/client/code?mobileNo="+mobile+"&random="+Math.random()});
	}

	/*获取短信验证码*/
	function getVerifyCode(){
		var url = "/api/common/client/sms";
		var paraMap = {
			"mobileNo":$("#mobile").val(),
			"verifyCode":$("#ticket").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var smsCode = result.smsCode;
						$("#mobile_btn").addClass("disabled").text("重新获取("+ count +"s)");
						$("#smsCode").val(smsCode);
						countDown();
					}
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("短信验证码获取失败,请稍后尝试");
		});
	}

	/*用户注册*/
	function submitUserInfo(){
		var url = "/api/common/client/register";
		var phone = $("#mobile").val();
		var password = $("#password").val();
		var paraMap = {
			"userName":$("#user_code").val(),
			"mobileNo":$("#mobile").val(),
			"nickName":$("#user_code").val(),
			"password":$("#password").val(),
			"smsCode":$("#smsCode").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
						$.msg("恭喜您注册成功",{
							"time":2000
						})
						login(phone,password);
				}else{
					$.alert(errorInfo);
				}
			}
		},function(data){
			$.alert("用户注册失败,请稍后尝试");
		});
	}

	function login(phone,password){
		var url = "/api/common/client/login";
		var paraMap = {
			"loginId":phone,
			"password":password
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						// $.alert("登录成功",function(){
						// 	window.location.href = loginPage;	
						// })
						window.setTimeout(function(){
							window.location.href = "./index.html";	
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

	function countDown(){
		var timer = window.setTimeout(function(){
			count --;
			$("#mobile_btn").addClass("disabled").text("重新获取("+ count +"s)");
			if(count <= 0){
				window.clearTimeout(timer);
				count = TIME;
				$("#mobile_btn").removeClass("disabled").text("获取验证码");
			}else{
				countDown();
			}
		},1000);
	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});