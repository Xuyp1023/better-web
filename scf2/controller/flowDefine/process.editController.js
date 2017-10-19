/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.editController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//详情
			$scope.info = {};

			//修改流程
			$scope.updateProcess = function(target){
				var $target = $(target);

				http.post(BTPATH.EDIT_WORKFLOW_BASE/*1*/,$scope.info/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('编辑流程成功!',{});
				 		window.history.back();
				 	}else{
				 		tipbar.errorTopTipbar($target,'编辑流程失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
			};

			//返回
			$scope.goBack = function(){
				window.history.back();
			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				//获取修改对象
				$scope.info = cache.get("process_edit_info");
				$scope.info.baseId = $scope.info.id;

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});