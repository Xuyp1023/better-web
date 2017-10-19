/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('step.defineController',['$scope','http','$rootScope','$route','cache', 'commonService','$timeout','$location',function($scope,http,$rootScope,$route,cache,commonService,$timeout,$location){

			//步骤详情
			$scope.info = {
				auditWay:'0',	//默认 串行审批
				moneyAudit: '1'	//默认 不启用金额段审批
			};

			$scope.selectFlow = {};
			$scope.selectNode = {};
			$scope.selectStep = {};

			$scope.readonly = false;

			//审批方式 下拉列表
			$scope.auditWayList = [{
				value:'0',
				name:'串行审批'
			},{
				value:'1',
				name:'并行审批'
			}];

			//是否金额段审批 下拉列表
			$scope.moneyEnableList = [{
				value:'0',
				name:'禁用'
			},{
				value:'1',
				name:'启用'
			}];

			

			//操作员列表 -- server
			$scope.operatorList = []; 
			
			//金额区间段列表 -- server
			$scope.moneySectionList = [];

			// 结果
			$scope.resultInfo = {};

			// 提交值
			$scope.postInfo = {};


			//添加操作员 - 操作状态
			$scope.addOperateAction = {
				status:"wait"
			};

			// 0-0 只管理操作员
			$scope.operator00 = '';

			// 0-1 需要处理金额段与操作员的关系
			$scope.operator01 = [];

			// 1-0 需要处理操作员与权重
			$scope.operator10 = [];

			// 1-1 需要处理金额段与操作员和权重
			$scope.operator11 = [];

			//返回
			$scope.goBack = function(){
				//window.history.back();
				// window.location.href = "home.html#/process/stepList";
				$location.path("/process/stepList")

			};

			//复选 选中|反选
			$scope.toggleCheckItem = function(item){
				item.isChecked = !item.isChecked;
			};

			//添加操作员
			$scope.addOperate = function(){
				$scope.addOperateAction.status = "complete";
			};

			//限制 权重 输入值类型
			$scope.validateInput = function(item,attrName){
				// var numRep = /{\d}*/;
				if (!/^\d+$/.test(item[attrName])){ 
					item[attrName] = /^\d+/.exec(item[attrName]);
					return false; 
				} 
			};

			//删除操作员
			$scope.delOperate = function(item,index){
				//如果有索引 index
				if(index || index+''==='0'){
					$scope.operator11[index].opers = ArrayPlus($scope.operator11[index].opers).delChild('value',item.value);
				}else{
					$scope.operator10 = ArrayPlus($scope.operator10).delChild('value',item.value);
				}
			};

			// 保存流程定义
			$scope.saveStepDefine = function(target) {
				var $target = $(target);

				$scope.postInfo.auditType = $scope.info.auditWay;
				$scope.postInfo.isMoney = $scope.info.moneyAudit;

				if ($scope.info.auditWay === '0' && $scope.info.moneyAudit === '0') {
					$scope.postInfo.approver = $scope.operator00;
				} else if ($scope.info.auditWay === '0' && $scope.info.moneyAudit === '1') {
					$scope.postInfo.approver = $scope.operator01;
					// for (var i = 0; i < $scope.postInfo.approver.length; i++) {
					// 	delete $scope.postInfo.approver[i].moneySection;
					// }
				} else if ($scope.info.auditWay === '1' && $scope.info.moneyAudit === '0') {
					$scope.postInfo.approver = $scope.operator10;
					for (var i = 0; i < $scope.postInfo.approver.length; i++) {
						$scope.postInfo.approver[i].operId = $scope.postInfo.approver[i].value;
					}
				} else if ($scope.info.auditWay === '1' && $scope.info.moneyAudit === '1') {
					$scope.postInfo.approver = $scope.operator11;
					for (var i = 0; i < $scope.postInfo.approver.length; i++) {
						for(var j = 0; j < $scope.postInfo.approver[i].opers.length; j++) {
							$scope.postInfo.approver[i].opers[j].operId = $scope.postInfo.approver[i].opers[j].value;
						}
					}
				}
				// 

				if(console) console.log($scope.postInfo);
				var data = JSON.stringify($scope.postInfo);
				
				http.post(BTPATH.SAVE_WORKFLOW_STEP_DEFINE, {baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,stepId:$scope.selectStep.id,data:data}).success(function(data) {
					if(common.isCurrentResponse(data)){
						$scope.$apply(function() {
							tipbar.infoTopTipbar('步骤定义保存成功!',{});
							window.history.back();
						});
					}
				});
			};

			// 重置流程定义 
			$scope.resetStepDefine = function() {
				$scope.info.auditWay = $scope.resultInfo.auditType;
				$scope.info.moneyAudit = $scope.resultInfo.isMoney;

				if (!$scope.info.auditWay) $scope.info.auditWay = '0';
				if (!$scope.info.moneyAudit) $scope.info.moneyAudit = '0';

				// 
				if ($scope.info.auditWay === '0' && $scope.info.moneyAudit === '0') {
					if(console) console.log("00--" + $scope.resultInfo.approver);
					if ($scope.resultInfo.approver) {
						$scope.operator00 = $scope.resultInfo.approver;
					}
				} else if ($scope.info.auditWay === '0' && $scope.info.moneyAudit === '1') {
					for (var i = 0; i < $scope.moneySectionList.length; i++) {
						for (var j = 0; j < $scope.resultInfo.approver.length; j++) {
							var appr = $scope.resultInfo.approver[j];
							if (appr.moneyId === $scope.operator01[i].moneyId) {
								$scope.operator01[i].operId = appr.operId ? appr.operId : $scope.operatorList[0].value; 
							}
						}
					}
				}
				else if ($scope.info.auditWay === '1' && $scope.info.moneyAudit === '0') {
					for (var i=0; i< $scope.resultInfo.approver.length;i++) {
						var item = $scope.resultInfo.approver[i];
						$scope.operator10.push({
							value:item.operId,
							weight:item.weight
						});
					}
				} else if ($scope.info.auditWay === '1' && $scope.info.moneyAudit === '1') {
					//循环金额区间
					for (var i = 0; i < $scope.moneySectionList.length; i++) {
						for (var j = 0; j < $scope.resultInfo.approver.length; j++) {
							var appr = $scope.resultInfo.approver[j];
							//匹配金额区间
							if (appr.moneyId !== $scope.operator11[i].moneyId) continue;
							var opers = appr.opers;
							for (var x = 0; x < opers.length; x++) {
								$scope.operator11[i].opers.push({
									value:opers[x].operId,
									weight:opers[x].weight
								});
							}
						}
					}
				}
			};

			//打开 选择操作员模板
			$scope.openOperateBox = function(list){
				$scope.openRollModal("select_operate_box");
				var unBindWatch = $scope.$watch("addOperateAction.status",function(newValue){
					if(newValue && newValue =="complete"){
						//已选中
						var checkedIds = ArrayPlus(list).extractChildArray("value",true);
						//本次选中
						var addList = ArrayPlus($scope.operatorList).objectChildFilter("isChecked",true);
						//去重
						addList = $.map(addList,function(item){
							if(checkedIds.indexOf(item.value)!=-1) return null;
							return item;
						});
						list = $.merge(list,addList);
						//重置待选列表
						$scope.operatorList = ArrayPlus($scope.operatorList).setKeyArrayObj("isChecked",false);
						//移除监听
						unBindWatch();
						$scope.addOperateAction.status = "wait";
					}else if(newValue=="cancel"){
						//移除监听
						unBindWatch();
					}
				});
			};

			//关闭  选择操作员模板
			$scope.closeOperateBox = function(){
				$scope.addOperateAction.status = "cancel";
			};

			$scope.init = function() {
				commonService.queryBaseInfoList(BTPATH.QUERY_OPERATOR_BY_CUSTNO,{custNo:cache.get("selected_flow").custNo},$scope,'operatorList','OperateDict').success(function(){
					commonService.queryBaseInfoList(BTPATH.QUERY_WORKFLOW_MONEYSECTION_LIST,{baseId:$scope.selectFlow.id},$scope,'moneySectionList').success(function(){
						http.post(BTPATH.FIND_WORKFLOW_STEP_DEFINE, {baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,stepId:$scope.selectStep.id}).success(function(data) {
							if(common.isCurrentData(data)){
								$scope.$apply(function() {
									$scope.operator00 = $scope.operatorList[0].value;
									for (var i = 0; i < $scope.moneySectionList.length; i++) {
										$scope.operator01[i] = {moneyId:$scope.moneySectionList[i].id,moneySection:$scope.moneySectionList[i],operId:$scope.operatorList[0].value};
										$scope.operator11[i] = {moneyId:$scope.moneySectionList[i].id,moneySection:$scope.moneySectionList[i],opers:[]};
									}
									$scope.resultInfo = data.data;
									$scope.resetStepDefine();
									//转换
								});
								var boxsFilter = ["[ng-box-active='readonly=false']"];
								$scope.$$emiterMultipleBoxEnabled(boxsFilter);
							}
						});
					});
				});
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.selectNode = cache.get("select_node");
				$scope.selectFlow = cache.get("selected_flow").item;
				$scope.selectStep = cache.get("select_step");
				$scope.readonly = !!cache.get("selected_flow").readonly;

				$scope.init();

				common.resizeIframeListener();
			});
		}]);

	};

});