/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('loan.defineController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//金额区间段
			$scope.sectionList = [];

			$scope.info = {};

			$scope.editFlag = 0; // 0编辑状态  1添加状态  2有-1状态  3可添加状态
			
			//添加一行
			$scope.addMoneySection = function(){
				if ($scope.sectionList.length == 0) {
					$scope.sectionList.push({
						start:'0',
						end:'',
						status:0
					});
					$scope.editFlag = 1;
					return;
				}
				var record = $scope.sectionList[$scope.sectionList.length-1];
				if(!record.end) return false;
				var length = $scope.sectionList.length;
				$scope.sectionList[length-1].status = 1;
				$scope.sectionList.push({
					start:record.end,
					end:'',
					status:0
				});
				$scope.editFlag = 1;
			};

			//删除区间项
			$scope.deleteMoneySection = function(item, index){

				$scope.sectionList = ArrayPlus($scope.sectionList).delChild('start',item.start);
				if ($scope.sectionList.length > 1) {
					if(index < $scope.sectionList.length) {
						$scope.sectionList[index].start = $scope.sectionList[index - 1].end;
					}
				} 
				$scope.sectionList[0].start = '0';
				if ($scope.sectionList.length > 0 && $scope.sectionList[$scope.sectionList.length-1].end) {
					$scope.editFlag = 3;
				}
				
			};

			//删除金额段
			$scope.editMoneySection = function(item) {
				item.status = 0;
				$scope.editFlag = 0;		
			};

			// 保存金额段
			$scope.saveMoneySection = function(item, index,target) {
				var $target = $(target);
				if ($scope.editFlag === 1) {
					if(item.end && item.end*1 <= item.start*1) {
						item.status = 0;
						tipbar.errorTopTipbar($target,'结束金额不允许小于起始金额',3000,9992);
						return;
					}
				} else {
					if (index < $scope.sectionList.length - 1) {
						if ($scope.sectionList[index+1].end && item.end*1 >= $scope.sectionList[index+1].end*1) {
							item.status = 0;
							tipbar.errorTopTipbar($target,'金额不允许大于下一段结束金额',3000,9992);
							return;
						}
						if (index !== 0) {
							if (item.end*1 <= item.start*1) {
								item.status = 0;
								tipbar.errorTopTipbar($target,'结束金额不允许小于起始金额',3000,9992);
								return;
							}
						}
						$scope.sectionList[index+1].start = item.end;
					}
					
					
				}

				if (!$scope.sectionList[$scope.sectionList.length-1].end) {
					$scope.editFlag = 2;		
				} else {
					$scope.editFlag = 3;
				}
				item.status = 1;
			};

			// 保存金额段
			$scope.saveMoneySectionDefine = function(target) {
				var $target = $(target);
				if ($scope.sectionList.length == 1) {
					tipbar.errorTopTipbar($target,'不允许为一个金额段',3000,9992);
					return;
				}
				if ($scope.sectionList.length > 0 && $scope.sectionList[$scope.sectionList.length-1].end) {
					tipbar.errorTopTipbar($target,'结束金额必须为空',3000,9992);
					return;
				}
				$scope.info.moneySection = '';
				for (var i = 0; i < $scope.sectionList.length;i++ ) {
					if (i === 0) {
						$scope.info.moneySection = '0,' + ($scope.sectionList[i].end ? $scope.sectionList[i].end : '-1');
					} else if (i === $scope.sectionList.length - 1) {
						$scope.info.moneySection += ',-1';
					} else {
						$scope.info.moneySection += ',' + $scope.sectionList[i].end;
					}
				}

				if(console) console.log($scope.info.moneySection);

				http.post(BTPATH.SAVE_WORKFLOW_MONEYSECTION,{baseId:$scope.info.id, moneySection:$scope.info.moneySection}).success(function(data){
					$scope.$apply(function(){
						tipbar.infoTopTipbar('保存金额段定义成功!',{});
					});
				});
			};

			//返回
			$scope.goBack = function(){
				window.history.back();
			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();

				$scope.info = cache.get("selected_flow").item;
				//查询金额段
				http.post(BTPATH.QUERY_WORKFLOW_MONEYSECTION,{baseId:$scope.info.id}).success(function(data){

					$scope.$apply(function(){

						if(!common.isCurrentData(data)){
							 $scope.editFlag = 3;
							 return;
						}

						var arr = data.data.split(",");
						//构建金额区间数组
						var buildArr = [];
						for(var i = 0; i < arr.length-1; i++){
							buildArr.push({
								start:arr[i],
								end:arr[i+1],
								status:1
							});
						}
						if (buildArr.length > 0) {
							buildArr[buildArr.length-1].end='';
							$scope.sectionList = buildArr;
							$scope.editFlag = 2;
						} else {
							$scope.editFlag = 3;
						}

					});
				});

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});