/*
	融资录单
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
    var date = require("date");


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','date']);

	//扩充公共指令库/过滤器
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);


	//控制器区域
	mainApp.controller('orderEntry',['$scope',function($scope){

		//订单分页配置
		/*$scope.pageConf = {
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
		});*/

		//客户订单列表
		$scope.orderList = [];

		$scope.orderSearch = {
			"begin_date":new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			"end_date":new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
		};

	}]);

});
});
});