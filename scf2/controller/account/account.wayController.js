/*
选择开户途径
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('account.wayController',['$scope','http','$rootScope','$route','cache','$location',function($scope,http,$rootScope,$route,cache,$location){

			//选择开户信息
			$scope.openInfo = {
				type:'own'
			};

			$scope.nextStep= function(target){
				if(!$scope.openInfo.type) return;
				switch($scope.openInfo.type){
					case 'own':
						// window.location.href="#/account/ownOpen/";
						$location.path("/account/ownOpen");
						break;
					case "replace":
						// window.location.href="#/account/replace/";
						$location.path("/account/replace");
						break;
				}

			};


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

				http.post(BTPATH.FIND_OPENACCOUNT_APPLY_STATUS,{}).success(function(data){
						$scope.$apply(function(){
							var status = data.data;
							//若不存在代录信息,查询开户信息表
							if(!status) {
								http.post(BTPATH.FIND_OPEN_ACCOUNT_INFO,{}).success(function(data){
										if(data&&(data.code === 200)){
											var infoStatus = data.data.businStatus;
											//不存在，跳转到开户选择
											if(!infoStatus){
												$("#alldiv").removeClass("hide");
												return;
											}//审核
											else if(infoStatus == "1"||infoStatus == "4") {
												$scope.$apply(function(){
													$location.path("/account/accountAuditing");
												})
												return;
											}//成功
											else if (infoStatus == "2") {
												$scope.$apply(function(){
													$location.path("/account/success");
												})
												return;
											}
										} else {
											// tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
											tipbar.infoTopTipbar('状态查询失败，服务端返回信息:'+data.message,{
											    msg_box_cls : 'alert alert-warning alert-block',
											    during:2000
											});
										}

								});
								return ;
							}
							//等待激活
							else if(status == '4') {
								$location.path("/account/active");
								return;
							} //审核中
							else if(ArrayPlus(['0','1','2','3','5','7']).isContain(status)){
								$location.path("/account/accountAuditing");
								return;
							} //开户成功
							else if(status == '6') {
								$location.path("/account/success");
								return;
							} //未开户跳转选择
							$("#alldiv").removeClass("hide");
						});
				});

			});
		}]);

	};

});
