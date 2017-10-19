/*
  待办流程
  作者:tanp
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
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
    var date = require("date");
    require('modal');
    require('date');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);
	
	//扩充公共服务
	comservice.servPlus(mainApp);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//业务模块
	mainApp.service('mainService',['$rootScope',function($rootScope){
		return {};
	}]);


	//控制器区域
	mainApp.controller('mainController',['$scope','mainService','commonService',function($scope,mainService,commonService){
		$scope.typeList = BTDict.FlowType.toArray('value','name');
		$scope.searchData = {
			flowName:'',
			GTFlowDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTFlowDate:new Date().format('YYYY-MM-DD'),
			flowType:'',
			currentNodeId:''
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//待办流程列表
		$scope.infoList = [];
		//流程节点下拉
		$scope.flowNodesList=[];

		/*事件处理区域*/
		//查询
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取待办流程列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.QUERY_CURRENT_WORK_TASK,$.extend({},$scope.searchData,$scope.listPage),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.infoList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			},'json');
		};

		//页面初始化
		$scope.initPage = function(){
			//获取审批节点
			commonService.queryBaseInfoList(BTPATH.QUERY_ACTIVITY_NODES_BY_TYPE,{flowType:$scope.searchData.flowType},$scope,'flowNodesList','flowNodesListDic',{
				name:'sysNodeName',
				value:'sysNodeId',
				isChange:true
			}).success(function(){
				$scope.queryList(true);
			});
		};

		//改变机构的联动
		$scope.changeCust = function(){
			//获取审批节点
			commonService.queryBaseInfoList(BTPATH.QUERY_ACTIVITY_NODES_BY_TYPE,{flowType:$scope.searchData.flowType},$scope,'flowNodesList','flowNodesListDic',{
				name:'sysNodeName',
				value:'sysNodeId',
				isChange:true
			});
		};

		/*事件处理区域*/
		//流程分配
		$scope.flowAssign = function(){
			$scope.openRollModal("flow_assign_box");
		};

		//流程查看
		$scope.flowInfo = function($target,data){
			$scope.openRollModal("flow_info_box");
		};

		$scope.flowImageInfo = function(data){
			$('#detail_iframe').attr('src',BTPATH.QUERY_FLOW_IMAGE+'?rn='+Math.random()+'&businessId='+data.businessId);
			$scope.openRollModal("flow_image_box");
		};

		$scope.initPage();

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

