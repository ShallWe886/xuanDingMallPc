define(["scripts/configuration","jquery"],function(config,$) {
	(function($) {
		$.extend({
			"REQURL":config.reqUrl,
			alert:function(msg,success){
				layer.alert(msg,success);
			},
			confirm:function(msg,success,fail,option){
				if(option){
					layer.confirm(msg,option,success,fail);
				}else{
					layer.confirm(msg,success,fail);					
				}
			},
			prompt:function(option,success){
				layer.prompt(option,success);
			},
			msg:function(msg,option){
				layer.msg(msg,option);
			},
			close:function(index){
				layer.close(index);
			},
			setSStorage:function(key,value){
				sessionStorage.setItem("mall."+key,value);
			},
			getSStorageInfo:function(key){
				return sessionStorage.getItem("mall."+key);
			},
			removeSStorage:function(key){
				if(key){
					sessionStorage.removeItem("mall."+key);
				}else{
					sessionStorage.clear();
				}
			},
			setLStorage:function(key){
				localStorage.setItem("mall."+key,value);
			},
			getLStorageInfo:function(key){
				return localStorage.getItem("mall."+key);
			},
			removeLStorage:function(key){
				if(key){
					localStorage.removeItem("mall."+key);
				}else{
					localStorage.clear();
				}
			},
			isMobile:function(mobile){
				var reg = /^1[0-9]{10}$/;
				if(reg.test(mobile)){
					return true;
				}else{
					return false;
				}
			},
			isNumber:function(number){
				var reg = /^[0-9]+$/;
				if(reg.test(number)){
					return true;
				}else{
					return false;
				}
			},
			isPwd:function(input){
				var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,12})$/;
				if(reg.test(input)){
					return true;
				}else{
					return false;
				}
			},
			formatDate:function(dateString){
				var date = new Date(dateString);
                var y = date.getFullYear();  
                var m = date.getMonth() + 1;  
                m = m < 10 ? ('0' + m) : m;  
                var d = date.getDate();  
                d = d < 10 ? ('0' + d) : d;  
                var h = date.getHours();  
                h=h < 10 ? ('0' + h) : h;  
                var minute = date.getMinutes();  
                minute = minute < 10 ? ('0' + minute) : minute;  
                var second=date.getSeconds();  
                second=second < 10 ? ('0' + second) : second;  
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
			},
			bindEvent:function(ele,callback,type){
				type = type || "click";
				$(ele).on(type,callback);
			},
			preBindEvent:function(parents,children,callback,type){
				type = type || "click";
				$(parents).on(type,children,callback);
			},
			pageInit:function(pageCode,paraMap){
				pageInit(pageCode,paraMap);
			},
			getPageParam:function(key){
			   var name,value;
			   var str=location.href; //取得整个地址栏
			   var num=str.indexOf("?");
			   var map = {};
			   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

			   var arr=str.split("&"); //各个参数放到数组里
			   console.log(arr);
			   for(var i=0;i < arr.length;i++){
			        num=arr[i].indexOf("=");
			        if(num>0){
			             name=arr[i].substring(0,num);
			             value=arr[i].substr(num+1);
			             map[name]=value;
			        }
			   }
			   for(i in map){
			   	  if(i == key){
			   	  	return map[key]
			   	  }
			   }
			   return map;
			},
			invoke:function(reqUrl,paraMap,successFunc,failFunc,ctrlParam,timeoutFunc){
				var _this = this;
				ctrlParam = ctrlParam || {};
				paraMap = paraMap || {};
				var type = ctrlParam.type || "post";
				var isAsync = ctrlParam.isAsync || true;
				var outTime = ctrlParam.outTime || 15000;
				var url = _this.REQURL + reqUrl;
				if(url == _this.REQURL){
					return false;
				}
				$.ajax({
					"url":url,
					"type":type,
					"data-type":"json",
					"data":JSON.stringify(paraMap),
					"contentType": "application/json",
					"async":isAsync,
					"timeout":outTime,
					"xhrFields": {
            			withCredentials: true
        			},
        			"crossDomain": true,
					success:function(data){
						var errorNo = data.errorNo;
						if("-999" == errorNo){
							window.location.href="./login.html";
						}
						if(successFunc){
							successFunc(data);
						}
					},
					error:function(data){
						if(failFunc){
							failFunc(data);
						}
					},
				　　complete:function(XMLHttpRequest,status){ //请求完成后最终执行参数
				　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
				 　　　　　 ajaxTimeoutTest.abort();
				　　　　}               
				　　}
				});
			},
			invokeLocal:function(reqUrl,paraMap,successFunc,failFunc,ctrlParam,timeoutFunc){
				var _this = this;
				ctrlParam = ctrlParam || {};
				paraMap = paraMap || {};
				var type = ctrlParam.type || "post";
				var isAsync = ctrlParam.isAsync || false;
				var outTime = ctrlParam.outTime || 15000;
				var url = _this.REQURL + reqUrl;
				if(url == _this.REQURL){
					return false;
				}
				$.ajax({
					"url":"../data/banner.json",
					"type":"POST",
					"data-type":"json",
					"data":"",
					"contentType": "application/json",
					"async":false,
					"timeout":15000,
					success:function(data){
						if(successFunc){
							successFunc(data);
						}
					},
					error:function(data){
						if(failFunc){
							failFunc(data);
						}
					},
				　　complete:function(XMLHttpRequest,status){ //请求完成后最终执行参数
				　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
				 　　　　　 ajaxTimeoutTest.abort();
				　　　　}               
				　　}
				});
			}
		})
	})($)
	function checkPerssion(pageCode,param){
		var checkPage = config.checkPerssionPageCode;
		if($.inArray(pageCode,checkPage) >= 0){
			if("1" != $.getSStorageInfo("logintstate")){
				window.location.href = "./login.html";
			}
			return true;
		}else{
			return false;
		}
	}

	$(document).ready(function(){
		require(["scripts/"+pageCode],function(a){
			if(a && a.init){
				// (function(){
				// var _hmt = _hmt || [];
				// var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?ec23547057d44e8e0c28e5d776700ec8";
				// var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);
				// })();
				a.init();

				window.setTimeout(function(){
					$("#nb_nodeboard").hide();
					$("#nb_icon_wrap").hide();
				},400);
			}
			if(a && a.bindPageEvent){
				a.bindPageEvent();
			}
			if(a && a.destory){
				a.destory();
			}
		});
	});

	/* 省市区三级联动 */
	function saveDivision(){
		var url = "/api/common/administrative/division/get";
		var paraMap = {
			"parentRegionCode":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var results = data.result;
					var adressMap = {};
					for(var i = 0 ; i<results.length;i++){
						adressMap[results[i].regionCode]=results[i];
					}
					$.setSStorage("localCity",JSON.stringify(adressMap));
				}
			}
		},function(data){
			console.log("查询省市区联动失败");
		});
	}
	if(!$.getSStorageInfo("localCity")){
		saveDivision();		
	}
	if(!$.getSStorageInfo("dict")){
		queryDict();	
	}

	function queryDict(){
		var url = "/api/common/tree/list";
		var paraMap = {
			"parents":"mall.product",
			"nodeValue":"frontEnd"
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var results = data.result;
					var children = results.childs;
					var dictMap = {};
					for (var i = children.length - 1; i >= 0; i--) {
						dictMap[children[i].nodeValue] = children[i];
					}
					console.log(dictMap);
					$.setSStorage("dict",JSON.stringify(dictMap));
				}
			}
		},function(data){
			console.log("查询数字字典失败");
		});
	}

	function pageInit(url,paraMap){
        //首先创建一个form表单  
        var tempForm = document.createElement("form");    
        tempForm.id="tempForm1";  
        //制定发送请求的方式为post  
        tempForm.method="post";   
        //此为window.open的url，通过表单的action来实现  
        tempForm.action=url;  
        //利用表单的target属性来绑定window.open的一些参数（如设置窗体属性的参数等）  
        tempForm.target="_self";
        //创建input标签，用来设置参数
        for(var param in paraMap){
            var value = paraMap[param],
                input = document.createElement('input');
            input.type = 'hidden';
            input.name = param;
            input.value = value;
            tempForm.appendChild(input);
        }
        //将此form表单添加到页面主体body中  
        document.body.appendChild(tempForm); 
        //手动触发，提交表单  
        tempForm.submit();
        //从body中移除form表单  
        document.body.removeChild(tempForm);

		postsubmit(pageCode,getString(),'about:blank');
	}


	function queryCommonHead(){
		var userInfo = JSON.parse($.getSStorageInfo("userInfo")) || {};
		if(userInfo.nickName || userInfo.mobileNo){
			var name = userInfo.nickName || userInfo.mobileNo;
			$(".login_out").show();
			$(".head_userName a").text(name).parents(".head_userName").show();
			$(".head_register").hide();
			$(".head_login").hide();
			$(".index_login_btn").hide();
			$(".index_login p").html("HI&#160;&#160;"+name+"<br/>欢迎您!");
		}else{
			$(".login_out").hide();
			$(".head_register").show();
			$(".head_login").show();
			$(".head_userName").hide();
			$(".index_login_btn").show();
			$(".index_login p").html("HI&#160;&#160;恭迎圣上");
		}
		var num = 0;
		var url = "/api/mall/cart/list";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						for(key in result){
							if(result[key]){
								num += result[key].num;	
							}		
						}
					}
					$(".head_cart span").text(num);
				}
			}
		});

		$.bindEvent(".header_search a",function(e){
			var input = $(".header_search input").val();
			queryTyreList(input);
			e.stopPropagation();
		},"click")

		$.bindEvent(".login_out",function(e){
			$.confirm("是否确定退出登录",function(index){
				$.close(index);
				loginout(index);
			})
			e.stopPropagation();
		},"click");

		$.bindEvent(".header_state li:last a",function(e){
			$("#nb_icon_wrap").click();
			e.stopPropagation();
		},"click")
	}

	function loginout(){
		var url = "/api/common/client/logout";
		var paraMap = {

		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					$.removeSStorage("logintstate");
					$.removeSStorage("userInfo");
					// queryCommonHead();
					window.location.href = "./index.html";
				}
			}
		},function(data){
			console.log("注销失败");
		});
	}

	function queryTyreList(input){
		if(!input){
			return;
		}
		var url = "/api/mall/product/list";
		var paraMap = {
			"q":"productName:" + "*"+input+"*",
			"fl":"",
			"sort":""
		}
		$.invoke(url,paraMap,function(data){
			if(data){
				var errorNo = data.errorNo;
				var errorInfo = data.errorInfo;
				if(0 == errorNo){
					var result = data.result;
					if(result){
						var list = result.list;
						var eleHtml = "<ul>";
						for(var i = 0;i<list.length;i++){
							eleHtml += '<li data-productCode="'+  list[i].productCode+'">' + list[i].productName + '</li>'
						}
						$(".header_search a").next().remove();
						$(".header_search").append(eleHtml);
						if(list.length >6){
							$(".header_search").css({"height":"240px","overflow":"auto"});
						}else{
							$(".header_search").css({"height":"auto"});
						}
						$.bindEvent(".header_search li",function(e){
							var code = $(this).attr("data-productCode");
							if(code){
								window.location.href="./pdDetail.html?productCode="+code;
							}
							e.stopPropagation();
						},"click");
					}
				}
			}
		},function(data){
			$.alert("未查询到符合条件的商品");
		});
	}



	$.bindEvent("body",function(){
		$(".header_search ul").remove();
	},"click")

    return {
    	"checkPerssion":checkPerssion,
    	"queryCommonHead":queryCommonHead
    }
});