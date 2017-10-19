/*

@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('account.replaceController',['$scope','http','$rootScope','$route','cache','commonService','upload',function($scope,http,$rootScope,$route,cache,commonService,upload){
			//注册上传组件
			upload.regUpload($scope);

			//平台开户信息
			$scope.info = {
			};

			$scope.uploadList = [];

			 //删除附件项
		    $scope.delUploadItem = function(item,listName){
		    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
		    };

		    //开启上传
			$scope.openUpload = function(event,type,typeName,list){
				$scope.uploadConf = {
					//上传触发元素
					event:event.target||event.srcElement,
					//上传附件类型
					type:type,
					//类型名称
					typeName:typeName,
					//存放上传文件
					uploadList:$scope[list]
				};
			};


			//代录申请
			$scope.addInstead = function(target) {
				var $target = $(target);

				$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
				http.post(BTPATH.SAVE_INSTEAD_APPLY,$scope.info)
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('代录开户申请成功!',{});
							window.location.href="#/account/accountAuditing/";
						} else {
							tipbar.errorTopTipbar($target,'代录开户申请失败,服务器返回:'+data.message,3000,6662);
						}
					})
			}

			//上一步
			$scope.preStep = function() {
				window.location.href="#/account/accountWay/";
			}
					
			/*!入口*/ /*控制器执行入口*/ 
				$scope.$on('$routeChangeSuccess',function(){
					$scope.info=$.extend({},$scope.initInfo);
					commonService.queryBaseInfoList(BTPATH.FIND_SPECIAL_OPERATOR, {clerk:'1'}, $scope, 'operatorList').success(function(){
						var operator = $scope.operatorList[0];
						$scope.info.operId = operator.id;
					});
					common.resizeIframeListener();
				});
			}]);

	};

});