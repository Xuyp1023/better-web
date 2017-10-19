/*
  节点定义
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
	mainApp.controller('mainController',['$scope','mainService','commonService','http',function($scope,mainService,commonService,http){

		//初始化Info信息
		_initInfo = function(){
			return {
				nodeCustomName:'',
				sysNodeName:BTDict.SysNodeListDic.get(common.filterArrayFirst($scope.sysNodeList)),
				must:'0',
				sysNodeId:common.filterArrayFirst($scope.sysNodeList)
			};
		};

		$scope.typeList = BTDict.FlowType.toArray('value','name');
		$scope.sysNodeList = [];
		$scope.searchData = {
			flowType:common.filterArrayFirst($scope.typeList),
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		$scope.info = {};

		//节点定义列表
		$scope.infoList = [];

		/*事件处理区域*/
		//查询
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//刷新系统节点名称列表
		$scope.refreshSysFlowList = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_SYSNODELIST,{flowType:$scope.searchData.flowType},$scope,'sysNodeList','SysNodeListDic',{
				name:'nodeName',
				value:'id',
				isChange:true
			});
		};

		//获取节点定义列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.QUERY_NODELIST,$.extend({},$scope.searchData,$scope.listPage),function(data){
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

		//新增节点
		$scope.addInfo = function(target){
			var $target = $(target);

			//设置校验项 | 校验
			validate.validate($('#add_flow_node_box'),addValidOption);
			var valid = validate.validate($('#add_flow_node_box'));
			if(!valid) return;

			$scope.info.sysNodeName = BTDict.SysNodeListDic.get($scope.info.sysNodeId);
			http.post(BTPATH.ADD_FLOWNODE_INFO,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.closeRollModal('add_flow_node_box','fast',function(){
				 			dialog.success('流程节点新增成功!',3000);
				 		});
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'提交失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//编辑节点
		$scope.editInfo = function(target){
			var $target = $(target);

			//设置校验项 | 校验
			validate.validate($('#add_flow_node_box'),addValidOption);
			var valid = validate.validate($('#add_flow_node_box'));
			if(!valid) return;
			
			$scope.info.sysNodeName = BTDict.SysNodeListDic.get($scope.info.sysNodeId);
			http.post(BTPATH.EDIT_FLOWNODE_INFO,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.closeRollModal('add_flow_node_box','fast',function(){
				 			dialog.success('流程节点编辑成功!',3000);
				 		});
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'编辑失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//删除节点
		$scope.delInfo = function(target,item){
			var $target = $(target);
			dialog.confirm('请确认是否删除，删除后不可恢复!',function(){
				http.post(BTPATH.DEL_FLOWNODE_INFO,item)
					 .success(function(data){
					 	if(common.isCurrentResponse(data)){
					 		$scope.queryList(true);
					 	}else{
					 		tipbar.errorLeftTipbar($target,'删除失败,服务器返回:'+data.message,3000,9992);
					 	}
				});
			});
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.refreshSysFlowList();
			$scope.queryList(true);
		};


		//新增节点
		$scope.addFlowNode = function(){
			$scope.info = _initInfo();
			$scope.openRollModal("add_flow_node_box");
		};

		//编辑节点
		$scope.editFlowNode = function(item){
			$scope.info = $.extend({modiType:'edit'},item);
			$scope.openRollModal("add_flow_node_box");
		};

		$scope.initPage();

		var addValidOption = {
		      elements: [{
		          name: 'info.nodeCustomName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      }],
		      errorPlacement: function(error, element) {
		          var label = element.parents('td').prev().text().substr(0);
		          tipbar.errorLeftTipbar(element,label+error,0,99999);
		      }
		};

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

