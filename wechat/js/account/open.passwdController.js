/*
	@herb
	填写基本资料
*/

exports.installController = function(mainApp,common){

	mainApp.controller('open.passwdController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		_statusPicker = {};	
		
		/*VM绑定区域*/
		$scope.info = {};
		//阅读并同意
		$scope.readAndAgree = true;

		//切换密码栏可见
		$scope.toggleEye = function(model,attr){
			var name = model + '.' + attr,
				eyeAttr = attr + 'Eye';
			$scope[model][eyeAttr] = !$scope[model][eyeAttr];
			console.info($scope[model][eyeAttr]);
			var input = document.querySelector("[ng-model='"+ name +"']");
			input.type = $scope[model][eyeAttr] ? 'text' : 'password';
		};

       	$scope.accountNameValid = function(){
       		var userName = $scope.info.loginUserName.toLowerCase();
       		if(ArrayPlus(['admin','qiejf','wechat']).isContain(userName)) {
       			mui.alert('登录帐号不能使用' + $scope.info.loginUserName + ',请重新填写!','温馨提示');
       			$scope.info.loginUserName = '';
       		}
       	};



		//-------------------------------发送短信验证码 相关 start --------------------------

		//验证信息
		$scope.identifyInfo = {
			//是否允许发送验证码
			canSend:true,
			//读秒提示信息
			timerMsg:"",
			//输入的验证码
			// verifyCode:""
		};

		//验证码倒计时
		var timer;
		$scope.countDown = function(){
			var count = 60;
			$scope.identifyInfo.canSend = false;
			//倒计时 读秒
		    timer = setInterval(function(){
		    	if(count === 0){
		    		$scope.$apply(function(){
		    			$scope.identifyInfo.canSend = true;
		    		});
		    		clearInterval(timer);
		    	}else{
		    		$scope.$apply(function(){
		    			count-- ;
		    			$scope.identifyInfo.timerMsg = count + "秒后可重新发送";
		    		});
		    	}
		    },1000);
		};

		//清除验证码计时器
		function _clearTimer(){
			clearInterval(timer);
			$scope.identifyInfo.canSend = true;
			$scope.identifyInfo.timerMsg = "";
		}

		//向客户发送验证码
		$scope.sendIdentifyCode = function(){
			http.post(BTPATH.OPEN_ACCOUNT_VERIFY_CODE, {mobileNo:$scope.info.operMobile}).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});
		};
		//-------------------------------发送短信验证码 相关 end --------------------------







		//确认开户
		$scope.openAccount = function(){
			//勾选 -阅读并同意协议
			if(!$scope.readAndAgree){
				mui.alert('请阅读并同意协议','温馨提示');
				return;
			}

			if(!$scope.info.newDealPassword || !$scope.info.okDealPassword){
				mui.alert('交易密码不能为空','温馨提示');
				return;
			}


			if(!$scope.info.newLoginPassword || !$scope.info.okLoginPassword){
				mui.alert('登录密码不能为空','温馨提示');
				return;
			}

			if($scope.info.newPassword !== $scope.info.okPassword){
				mui.alert('两次输入的密码不一致','温馨提示');
				return;
			}
			
			http.post(BTPATH.APPLY_OPEN_ACCOUNT,$scope.info).success(function(data){
				if(common.isCurrentResponse(data)){
					window.location.href = '#/register/waitAudit';
				}else{
					mui.alert('申请失败,服务端返回信息:\n'+data.message,'错误信息');
				}
			});
			_clearTimer();
		};



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			/*$scope.queryInfo().success(function(){
				// $scope.queryFinanceUploadList();
			});*/
			$scope.info = cache.get("account_info");
			$('body').scrollTop(0);
		});
	}]);

};