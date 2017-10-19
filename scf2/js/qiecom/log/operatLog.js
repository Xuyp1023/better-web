/*
	登陆日志
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
    var date = require('date');
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
	//扩充公共指令库/过滤器
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope,mainService){

	$scope.searchData = {
		businStatus:'',
		GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
		LTEregDate:new Date().format('YYYY-MM-DD')
	};

	//分页 监听
    $scope.$watch('tradeListPage.pageNum', function(newValue,oldValue){
    	if(newValue!==oldValue){
    		$scope.reFreshFacApplyList(false);
    	}
    });
		

	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});