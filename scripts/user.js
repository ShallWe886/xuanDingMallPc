define(function (require, exports, module) {
	var common = require("scripts/common");
	var TIME = 60;
	var count = TIME;

	function before(){
		
	}

	function init(){
		var userInfo = JSON.parse($.getSStorageInfo("userInfo"));
		complete(userInfo);
		common.queryCommonHead();
	}
	function bindPageEvent(){
		/* 点击修改 */
		$.bindEvent($("#update"),function(e){
			$(".order_account_form").removeClass("disabled").find("input").attr({"disabled":false});
			$(this).hide().siblings("a").show();
		},"click");

		/* 点击保存 */
		$.bindEvent($("#save"),function(e){
			$(".order_account_form").addClass("disabled").find("input").attr({"disabled":true});
			$(this).hide().siblings("a").show();
			save();//保存新的用户资料
		},"click");

		/* 点击修改密码 */
		$.bindEvent($("#updatePassword"),function(e){
			$(".dialog_mask,.psd_dialog").show();
		},"click");

		/* 关闭弹窗 */
		$.bindEvent($("#close_btn"),function(e){
			$(".dialog_mask,.psd_dialog").hide();
			$(".psd_dialog input").val("");
		},"click");

		/* 修改密码 */
		$.bindEvent("#next_btn",function(){
			var password = $("#newPassword").val();
			var passwordNew = $("#oldPassword").val();
			if(!password || !passwordNew){
				layer.alert("旧密码不能为空");
				return;
			}
			if(!passwordNew){
				layer.alert("新密码不能为空");
				return;
			}
			if(!$.isPwd(passwordNew)){
				layer.alert("密码必须为包含数字,字母的6到12位字符");
				return;
			}
			var mobile = $("#psMobile").val();
			if(!$.isMobile(mobile)){
				layer.alert("手机号码格式不正确");
				return;
			}
			var smsCode = $("#smsCode").val();
			if(!smsCode){
				layer.alert("短信验证码不能为空");
				return;
			}
			updatePw();
		},"click");

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
				layer.alert("手机号码格式不正确");
				return;
			}
			var ticket = $("#ticket").val();
			if(!ticket){
				layer.alert("图形验证码不能为空");
				return;
			}
			getVerifyCode();//获取短信验证码
		},"click");

		/*手机号码输入框获得焦点*/
		$.bindEvent("#psMobile",function(){
			var mobile = $(this).val();
			if(mobile && mobile.length == 11){
				getTiekct();
				$("#verifyLi").show();
			}
		},"focus");

		/*手机号码输入框输入监听*/
		$.bindEvent("#psMobile",function(){
			var mobile = $(this).val();
			if(mobile && mobile.length == 11){
				getTiekct();
				$("#verifyLi").show();
			}
		},"input");
      
		/*手机号码输入框失去焦点*/
		$.bindEvent("#psMobile",function(){
			var mobile = $(this).val();
			if(!mobile || mobile.length != 11){
				$("#verifyLi").hide();
			}
		},"blur");
	}
	function destory(){

	}

	function updatePw(){
		var url = "/api/common/client/passwd";
		var paraMap = {
			"nickName":$("#nickName").val(),
			"oldPassword":$("#oldPassword").val(),
			"newPassword":$("#newPassword").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						layer.alert("密码重置成功");
						$(".dialog_mask,.psd_dialog").hide();
						$(".psd_dialog input").val("");
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("密码重置失败");
		});
	}

	function save(){
		var url = "/api/common/client/update";
		var paraMap = {
			"nickName":$("#nickName").val(),
			"mobileNo":$("#mobile").val(),
			"email":$("#email").val(),
			"alipayAccount":$("#payNo").val(),
			"alipayName":$("#payPhone").val()
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						complete(result);
						$.setSStorage("userInfo",JSON.stringify(result));
					}
				}else{
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("用户名或密码错误");
		});
	}

	/*获取图形验证码*/
	function getTiekct(){
		var mobile = $("#psMobile").val();
		if(!$.isMobile(mobile)){
			layer.alert("手机号码格式不正确");
			return;
		}
		$("#verifyCode").attr({"src":"http://mall.menghuanhua.com:9090/api/common/client/code?mobileNo="+mobile+"&random="+Math.random()});
	}

	/*获取短信验证码*/
	function getVerifyCode(){
		var url = "/api/common/client/sms";
		var paraMap = {
			"mobileNo":$("#psMobile").val(),
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
					layer.alert(errorInfo);
				}
			}
		},function(data){
			layer.alert("短信验证码获取失败,请稍后尝试");
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

	function complete(userInfo){
		userInfo = userInfo || {};
		$("#userName").val(userInfo.userName);
		$("#nickName").val(userInfo.nickName);
		$("#mobile").val(userInfo.mobileNo);
		$("#email").val(userInfo.email);
		$("#payNo").val(userInfo.alipayAccount);
		$("#payPhone").val(userInfo.alipayName);
	}

    module.exports = {
    	"before":before,
    	"init":init,
    	"bindPageEvent":bindPageEvent,
    	"destory":destory
    }
});