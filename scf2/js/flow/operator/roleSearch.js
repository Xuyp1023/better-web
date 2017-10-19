/*
  角色查询
作者:herb
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
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);
	
	//扩充公共指令库/过滤器
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope){
		/*VM绑定区域*/
		//分页数据
		$scope.pageConf = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//流程监控列表
		$scope.flowList = [];

		//分页 监听
		$scope.$watch('pageConf.pageNum', function(newValue,oldValue){
			if(newValue!==oldValue){
				//分页数据操作
			}
		});

		//查询所需信息
		$scope.searchData = {

		};

		//刷新角色列表数据
		$scope.reFreshRoleList = function(flag){
		};

		
		/*事件处理区域*/
		//新增角色
		$scope.showAddRole = function(){
			$scope.openRollModal("add_role_box");
		};


		//修改角色
		$scope.showEditRole = function(){
			$scope.openRollModal("edit_role_box");
		};


	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

