/*
	@herb
	填写基本资料
*/

exports.installController = function(mainApp,common){

	mainApp.controller('open.basicController',['$scope','muiSupport','http','$rootScope','$route','cache','commonService',function($scope,muiSupport,http,$rootScope,$route,cache,commonService){
		/*私有属性区域*/
		_statusPicker = {};

		/*VM绑定区域*/
		//开户企业类型
		$scope.companyTypes = BTDict.RegisterCompanyType.toArray('value','text');
		$scope.companyTypes[0].isChecked = true;

		$scope.info = {
			role:$scope.companyTypes[0].value
		};

		//单选 切换选择
		$scope.singleToggleItem = function(item,list){
			$scope.info.role = item.value;
			ArrayPlus(list).setKeyArrayObj("isChecked",false);
			ArrayPlus(list).setKeyArrayObj("isChecked",true,"value",item.value);
		};



		//签约验证信息
		$scope.identifyInfo = {
			//是否允许发送验证码
			canSend:"true",
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
			// agreeType  0|1|2  转让通知书|转让意见书|三方协议
			/*var requestType = $scope.financeInfo.requestType+'',
				agreeType = requestType==="4" ? 2 : 0;//融资类型为：供应商|4
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:agreeType
			};
			http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});*/

			//倒计时读秒
			$scope.countDown();
		};


		//-------------------------------发送短信验证码 相关 end --------------------------
		//提交，下一步
		$scope.nextStep = function(){
			if(!$scope.info.custName){
				mui.alert('请填写企业名称','温馨提示');
				return;
			}
			if(!$scope.info.operName){
				mui.alert('请填写经办人姓名','温馨提示');
				return;
			}
			if(!$scope.info.operEmail){
				mui.alert('请填写经办人电子邮箱','温馨提示');
				return;
			}
			if(!$scope.info.operMobile){
				mui.alert('请填写经办人手机号码','温馨提示');
				return;
			}
			http.post(BTPATH.SAVE_OPEN_ACCOUNT,$scope.info).success(function(data){
				if(common.isCurrentResponse(data)){
					cache.put("account_info",$scope.info);
					window.location.href = '#/register/upload';
				}else{
					mui.alert('保存失败,服务端返回信息:\n'+data.message,'错误信息');
				}
			});
		};



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			/*$scope.queryInfo().success(function(){
				// $scope.queryFinanceUploadList();
			});*/


			http.post(BTPATH.FIND_CUST_OPEN_ACCOUNT_TMP,{}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = $.extend({},$scope.info,data.data);
					});
					cache.put("account_info",$scope.info);
				}
			});

			/*commonService.queryBaseInfoList(BTPATH.FIND_CUST_OPEN_ACCOUNT_TMP, {}, $scope, 'info').success(function(){
				cache.put("account_info",$scope.info);

			});*/


		});
	}]);

};
