
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contractType.manageController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
			/*  VM绑定区域  */
			$scope.info = {};

			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10
			};

			/*  业务处理绑定区域  */

			//查询合同类型
			$scope.queryList = function(flag){
				$scope.listPage.flag = flag? 1 : 2;
				http.post(BTPATH.QUERY_REGISTERED_AGREEMENTTYPE,$.extend({},$scope.listPage)).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = data.data;
							if(flag){
								$scope.listPage = data.page;
							}
						});
					}
				});
			};
			//新增合同类型
			$scope.addInfo = function(){
				window.location.href = '#/contractType/contractTypeAdd';
			}

			//删除合同类型
			$scope.deleteInfo = function(target,item) {
				var $target = $(target);

				dialog.confirm('请确认是否删除此项合同类型?',function(){
					http.post(BTPATH.DELETE_AGREEMENTTYPE,{id:item.id})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('删除合同类型成功!',{});
							$scope.queryList(true);
						}else{
							tipbar.errorTopTipbar($target,'删除合同类型失败,服务器返回:'+data.message,3000,9992);
						}
					});
				});
			}

			//编辑合同类型
			$scope.editInfo = function(data) {
				cache.put("info", data);
				window.location.href = '#/contractType/contractTypeEdit';
			}




			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				$scope.listPage.flag = 1;

				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
