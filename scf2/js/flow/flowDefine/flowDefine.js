/*
流程管理
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker",'easyloader','jqueryPaser'],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    require('modal');
    require('date');
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//扩充公共服务
	comservice.servPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope','$timeout','http','commonService','form','easyPlugin',function($scope,$timeout,http,commonService,form,easy){
		/*VM绑定区域*/
		$scope.roleTypeList = BTDict.FlowNodeRole.toArray('value','name');
		$scope.typeList = BTDict.FlowType.toArray('value','name');
		$scope.operSelectList = [];
		$scope.moneySelectList = [];
		//节点审批方式
		$scope.flowAuditType = BTDict.FlowAuditType.toArray('value','name');
		//审批所用的操作员列表
		$scope.operList = [];
		$scope.moneyList = [];
		//==============================公共操作区 start=================================
		$scope.searchData = {
			flowType:$scope.typeList[0].value,
			monitorOperId:''
		};
		//流程总体数据
		$scope.flowWrap = {};
		//流程管理列表
		$scope.infoList = [];
		//单个流程管理信息
		$scope.info = {};

		//查询列表
		$scope.searchList = function(){
			$scope.queryList();
		};

		//获取流程管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			http.post(BTPATH.QUERY_OPENED_FLOW,$scope.searchData)
				.success(function(openedRole){
					if(typeof openedRole.data === 'object'){
						$scope.flowWrap = $.extend({},openedRole.data);
						delete $scope.flowWrap.stepList;
					}else{
						$scope.flowWrap = {};
					}
					http.post(BTPATH.QUERY_ACTIVITY_NODES_BY_TYPE,$scope.searchData).success(function(flowList){
						//关闭加载状态弹幕
						loading.removeLoading($mainTable);
						if(common.isCurrentData(flowList)){
							flowList.data = ArrayPlus(flowList.data).changeObjectChildProper('id','bridgeId');
							flowList.data = ArrayPlus(flowList.data).delObjectChildProper('id');
							$scope.$apply(function(){
								if((!openedRole.data)||(!openedRole.data.stepList)||(openedRole.data === '')||(openedRole.data.stepList === '')||(openedRole.data.stepList.length<=0)){
									$scope.infoList = common.addKey4ArrayObj(flowList.data,'isDefined',false);
								}else if((typeof openedRole.data === 'object')&&(typeof openedRole.data.stepList === 'object')&&(openedRole.data.stepList instanceof Array)){
									var initFlowList = common.extendObjectArray(openedRole.data.stepList,flowList.data,{
										newKeyName:'bridgeId',
										oldKeyName:'nodeId'
									});
									$scope.infoList = common.addKey4ArrayObj(initFlowList,'isDefined',true);
								}
								$scope.pakageFlowPercent();
							});
						}
					});
			});
		};

		//上移单个信息
		$scope.UpInfo = function(item){
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			var index = ArrayPlus($scope.infoList).indexOfObject('sysNodeId',item.sysNodeId);
			$scope.infoList = ArrayPlus($scope.infoList).interChangePreObject(index);
			loading.removeLoading($mainTable);
		};

		//下移单个信息
		$scope.DownInfo = function(item){
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			var index = ArrayPlus($scope.infoList).indexOfObject('sysNodeId',item.sysNodeId);
			$scope.infoList = ArrayPlus($scope.infoList).interChangeNextObject(index);
			loading.removeLoading($mainTable);
		};

		//删除节点
		$scope.delFlowNode =  function(item){
			dialog.confirm('请确定是否删除流程中的该节点,删除结果将以整体流程最终保存结果为准!',function(){
				$scope.$apply(function(){
					$scope.infoList = ArrayPlus($scope.infoList).delChild('bridgeId',item.bridgeId);
				});
			});
			
		}; 

		//组装流程节点
		$scope.pakageFlowPercent = function(){
			for (var i = 0; i < $scope.infoList.length; i++) {
				var tempFlow = $scope.infoList[i];
				tempFlow.nodeName = tempFlow.nodeCustomName;
				tempFlow.nodeId = tempFlow.bridgeId;
				tempFlow.auditType = ((!!tempFlow.auditType)&&(tempFlow.auditType !==''))?tempFlow.auditType:$scope.flowAuditType[0].value;
				tempFlow.isNeedMoney = '0';
				//金额段打包处理
				var tempAppRovers = (!!tempFlow.stepApprovers)&&(tempFlow.stepApprovers !=='')?tempFlow.stepApprovers:[];
				tempAppRovers = common.addKey4ArrayObj(tempAppRovers,'isChecked',true);
				//非金额段列表
				tempFlow.unMoneyAppRoversList = [];
				for (var k = 0; k < $scope.operList.length; k++) {
					var tempOper = $scope.operList[k];
					tempFlow.unMoneyAppRoversList.push($.extend({},tempOper,{
						auditMoneyId:5000,
						isChecked:false,
						weight:0
					}));
				}
				tempFlow.unMoneyAppRoversList = common.extendObjectArray(tempFlow.unMoneyAppRoversList,tempAppRovers,{
					oldKeyName:'auditMoneyId',
					newKeyName:'auditMoneyId',
					oldKeyNameTwo:'auditOperId',
					newKeyNameTwo:'auditOperId'
				});
				tempFlow.unMoneyAppRoversList = common.splitArray(tempFlow.unMoneyAppRoversList,3);
				//金额段列表
				tempFlow.moneyAppRoversList = [];
				for (var j = 0; j < $scope.moneyList.length; j++) {
					var tempMoney = $scope.moneyList[j];
					
					var tempMoneyAppRoversList = [];
					for (var l = 0; l < $scope.operList.length; l++) {
						var tempOper = $scope.operList[l];
						tempMoneyAppRoversList.push($.extend({},tempOper,{
							auditMoneyId:tempMoney.auditMoneyId,
							isChecked:false,
							weight:0
						}));
					}
					tempMoneyAppRoversList = common.extendObjectArray(tempMoneyAppRoversList,tempAppRovers,{
						oldKeyName:'auditMoneyId',
						newKeyName:'auditMoneyId',
						oldKeyNameTwo:'auditOperId',
						newKeyNameTwo:'auditOperId'
					});
					tempMoneyAppRoversList = common.splitArray(tempMoneyAppRoversList,3);
					tempFlow.moneyAppRoversList.push(tempMoneyAppRoversList);
				}
				
			}
		};

		//编辑流程节点管理
		$scope.editInfo = function(target){
			var $target = $(target);
			if($scope.info.nodeRole === 'Factoring'){
				var targetStepApprovers = [];
				if($scope.info.isNeedMoney === '0'){
					targetStepApprovers = common.extractMultipleObjectArray($scope.info.moneyAppRoversList);
				}else{
					targetStepApprovers = common.extractMultipleObjectArray($scope.info.unMoneyAppRoversList);
				}
				targetStepApprovers = ArrayPlus(targetStepApprovers).objectChildFilter('isChecked',true);
				if($scope.info.auditType === 'serial'){
					targetStepApprovers = common.addKey4ArrayObj(targetStepApprovers,'weight',100);
				}
				$scope.info.stepApprovers = targetStepApprovers;
			}else{
				$scope.info.stepApprovers = [];
			}
			$scope.info.isDefined = true;
			$scope.closeRollModal('edit_box','fast',function(){
				dialog.success('您已成功保存该流程节点的定义！',3000);
			});
		};

		//保存整个流程管理
		$scope.editInfoList = function(target){
			var $target = $(target);
			var flowInfo = $.extend({},$scope.searchData,{
				monitorOperName:BTDict.OperSelectListDic.get($scope.searchData.monitorOperId),
				stepList:$scope.infoList
			},$scope.flowWrap);
			flowInfo = JSON.stringify(flowInfo);
			http.post(BTPATH.EDIT_FLOWLIST_INFO,{data:flowInfo}).success(function(data){
				if(common.isCurrentResponse(data)){
					tipbar.errorTopTipbar($target,'成功更新流程节点列表!',3000);
				}
			});
		};
		//获取该流程所有菜单列表
		$scope.queryAllMenu = function(){
			return http.post(BTPATH.QUERY_LIST_MENU,{roleId:$scope.info.id});
		};

		//更改流程菜单
		$scope.editMenuList = function(target){
			var $target = $(target);
			http.post(BTPATH.EDIT_MENU_LIST,{
				roleId:$scope.info.id,
				roleName:$scope.info.roleName,
				menuIdArr:easy.getTreeCheckedId($('#select_box .menuList'))
			}).success(function(data){
				if(common.isCurrentResponse(data)){
					tipbar.errorTopTipbar($target,'绑定流程菜单成功!',3000,6662);
				}else{
					tipbar.errorTopTipbar($target,'绑定流程菜单失败,服务器返回:'+data.message,3000,6662);
				}
			});
			
		};

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_SELECT_OPERATOR,{},$scope,'operSelectList','OperSelectListDic',{
				name:'name',
				value:'id',
				isChange:true
			}).success(function(){
				$scope.searchData.operatorId =$scope.operSelectList.length>0? $scope.operSelectList[0].value:'';
				$scope.$apply(function(){
					$scope.operList = BTDict.OperSelectListDic.toArray('auditOperId','auditOperName');
					$scope.searchData.monitorOperId = $scope.operSelectList.length>0?$scope.operSelectList[0].value:'';
				});

				//获取金额段
				commonService.queryBaseInfoList(BTPATH.QUERY_ALL_MONEYPART,{},$scope,'moneySelectList','MoneyListDic',{
					name:'auditMaxAmount',
					value:'id'
				}).success(function(){
					$scope.moneyList = BTDict.MoneyListDic.toArray('auditMoneyId','auditMaxAmount');
					$scope.queryList();
				});
				
			});
		};

		/*
		 *模板显隐控制区域
		*/
		//打开流程管理录入
		$scope.addInfoBox = function(){
			$scope.info = {
				roleType:$scope.typeList[0].value,
				businStatus:$scope.statusList[0].value,
				modiType:'add'
			};
			$scope.openRollModal('add_box');
		};

		//打开流程管理编辑
		$scope.editInfoBox = function(data){
			$scope.info = data;
			$scope.openRollModal('edit_box');
		};

		//打开流程管理审核
		$scope.checkInfoBox = function(data){
			$scope.info = data;
		};

		//==============================公共操作区 end ==================================

		$scope.resizeHeight = function(){
			$timeout(function(){
				common.resizeIframeListener();
			});
			
		};

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


