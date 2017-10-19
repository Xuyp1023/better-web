/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.createController',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){

			//详情
			$scope.info = {};

			$scope.defaultList = [];

			//创建流程
			$scope.addProcess = function(target){
				var $target = $(target);

				http.post(BTPATH.ADD_WORKFLOW_BASE/*1*/,$scope.info/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增流程成功!',{});
				 		$scope.$apply(function(){
				 			$location.path('/process/list');
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增流程失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
			};

			//返回
			$scope.goBack = function(){
				// window.history.back();
				$location.path('/process/list');
				// window.location.href = '#/process/list';
			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.info.custNo =  cache.get("selected_cust").custNo;
				$scope.info.custName =  cache.get("selected_cust").custName;

				
				commonService.queryBaseInfoList(BTPATH.QUERY_DEFAULT_WORKFLOW_LIST,{},$scope,'defaultList').success(function(){
					$scope.info.defaultBaseId = $scope.defaultList[0] ? $scope.defaultList[0].value : '';
				});

				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});