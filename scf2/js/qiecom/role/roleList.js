/*
角色管理
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


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','form','easyPlugin',function($scope,http,commonService,form,easy){
		/*VM绑定区域*/
		$scope.statusList = BTDict.BusinDataStatus.toArray('value','name');
		$scope.typeList = BTDict.RoleType.toArray('value','name');
		$scope.custList = [];
		$scope.coreCustList = [];
		//==============================公共操作区 start=================================
		$scope.searchData = {
			roleName:''
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//角色管理列表
		$scope.infoList = [];
		//单个角色管理信息
		$scope.info = {};

		//查询列表
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取角色管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_ROLE,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.listPage = data.page;
							}
						});
					} 	
			});
		};

		//新增角色信息
		$scope.addInfo = function(target){

			//设置校验项 | 校验
			validate.validate($('#add_box'),validOption);
			var valid = validate.validate($('#add_box'));
			if(!valid) return;

			var $target = $(target);
			http.post(BTPATH.ADD_ONE_ROLE,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增角色成功!',{});
				 		$scope.closeRollModal("add_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增角色失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//编辑角色管理
		$scope.editInfo = function(target){

			//设置校验项 | 校验
			validate.validate($('#add_box'),validOption);
			var valid = validate.validate($('#add_box'));
			if(!valid) return;

			var $target = $(target);
			$scope.info.roleId = $scope.info.id;
			http.post(BTPATH.EDIT_ONE_ROLE,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('修改角色成功!',{});
				 		$scope.closeRollModal("add_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改角色失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//获取该角色所有菜单列表
		$scope.queryAllMenu = function(){
			return http.post(BTPATH.QUERY_LIST_MENU,{roleId:$scope.info.id});
		};

		//更改角色菜单
		$scope.editMenuList = function(target){
			var $target = $(target);
			http.post(BTPATH.EDIT_MENU_LIST,{
				roleId:$scope.info.id,
				roleName:$scope.info.roleName,
				menuIdArr:easy.getTreeCheckedId($('#select_box .menuList'))
			}).success(function(data){
				if(common.isCurrentResponse(data)){
					tipbar.infoTopTipbar('绑定角色菜单成功!',{});
				}else{
					tipbar.errorTopTipbar($target,'绑定角色菜单失败,服务器返回:'+data.message,3000,6662);
				}
			});
			
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.queryList(true);
			using('tree',function(){window.easyIsReady = true});
		};

		/*
		 *模板显隐控制区域
		*/
		//打开角色管理录入
		$scope.addInfoBox = function(){
			$scope.info = {
				roleType:$scope.typeList[0].value,
				businStatus:$scope.statusList[0].value,
				modiType:'add'
			};
			$scope.openRollModal('add_box');
		};

		//打开角色管理编辑
		$scope.editInfoBox = function(data){
			$scope.info = $.extend(data,{modiType:'edit'});
			$scope.openRollModal('add_box');
		};

		//打开角色管理审核
		$scope.checkInfoBox = function(data){
			$scope.info = data;
			$scope.queryAllMenu().success(function(data){
				if(common.isCurrentData(data)&&window.easyIsReady){
					$('#select_box .menuList').tree({
						animate:true,
						checkbox:true,
						data:data.data
					});
					$scope.openRollModal('select_box');
				}
				
			});
		};

		//==============================公共操作区 end ==================================

		/*数据初始区域*/
		$scope.initPage();

		//校验配置
		var validOption = {
		      elements: [{
		          name: 'info.roleName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.roleType',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.businStatus',
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


