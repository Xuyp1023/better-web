
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractAdd',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.info = {};

      /*  业务处理绑定区域  */

			//登记
			$scope.addInfo = function(target){
				var $target = $(target);
				$scope.findTypeName($scope.info.typeId);
				http.post(BTPATH.ADD_CONTRANCT_STANDARD,$scope.info).success(function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('登记标准合同成功!',{});
						$scope.$apply(function(){
							$location.path("/standardContract/list");
						});
						// window.location.href = '#/standardContract/list';
					}else{
						tipbar.errorTopTipbar($target,'登记标准合同失败,服务器返回:'+data.message,3000,9992);
					}
				});
			};

			$scope.findTypeName = function(typeId) {
				if($scope.typeList){
					for (var i = $scope.typeList.length - 1; i >= 0; i--) {
						if($scope.typeList[i].id==typeId){
							$scope.info.typeIdName=$scope.typeList[i].agreementTypeName;
						}
					}

				}

			}

			$scope.goBack = function(){
				$location.path("/standardContract/list");
				// window.location.href = '#/standardContract/list';
			};



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'typeList').success(function(){

						$scope.$apply(function(){
							$scope.info.typeId = common.filterArrayFirst($scope.typeList,'id');
						});
						
				});
				/*公共绑定*/
				common.resizeIframeListener();
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
