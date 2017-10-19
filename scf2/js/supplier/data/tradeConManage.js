/*
	贸易合同管理
	@anthor : herb
*/

define(function(require,module,exports){

	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var comfilter = require("filter");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var upload = require("upload");
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','upload']);
	//扩充公共指令库/过滤器
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope,mainService){

		//订单分页配置
		$scope.pageConf = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//分页 监听
		$scope.$watch('pageConf.pageNum', function(newValue,oldValue){
			if(newValue!==oldValue){
				//分页数据操作
			}
		});

		//客户订单列表
		$scope.contractList = [];

		//查询条件
		$scope.searchData = {};

		//合同附件
		$scope.contractAttach = [];

		//---------------------------弹板操作-------------------------start


		//新增合同弹出
		$scope.addContractBox = function(){
			$scope.openRollModal('add_contract_box');
		};

		//编辑合同弹出
		$scope.editContractBox = function(){
			$scope.openRollModal('edit_contract_box');
		};

		//---------------------------弹板操作-------------------------end
		


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
		

		//日期处理
		$scope.dateEmitter = {
			changeDateInfo : function(event){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};


	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});