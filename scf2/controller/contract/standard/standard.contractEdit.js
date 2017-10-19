
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractEdit',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.info = {};

      /*  业务处理绑定区域  */

			//保存
			$scope.saveInfo = function(target){
				var $target = $(target);

				http.post(BTPATH.EDIT_CONTRANCT_STANDARD,$scope.info)
				.success(function(data){
					if(data&&(data.code == 200)){						
							// $location.path("/standardContract/list");
							window.location.href = '?rn'+new Date().getTime()+'#/standardContract/list';
						
						// window.location.href = '#/standardContract/list';
					}else{
						tipbar.errorTopTipbar($target,'编辑标准合同失败,服务器返回:'+data.message,3000,9992);
					}
				});
			};

			$scope.goBack = function(){
				// $location.path("/standardContract/list");
				window.location.href = '?rn'+new Date().getTime()+'#/standardContract/list';
			};



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

				$scope.info = cache.get("info");

				commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'typeList').success(function(){
						
				});
				
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
