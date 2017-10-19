/*
基础设置 (供应商)
@anthor : herb
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
    var multiple =require("multiSelect");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date','multiple']);

	//扩充公共指令库 | 过滤器 | 公共服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
    comservice.servPlus(mainApp);
    
	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
        
        /*字典数据*/
    
		/*VM绑定区域*/
        //供应商列表
        $scope.supplierList = [];

        //设置
        $scope.config = {
            custNo:'',
            creditFirst:0,
            businessFirst:0,
            isPush:0
        };




    // ------------------------------------------------ 业务操作 start -------------------------------------------------------
    $scope.saveParam = function(target){
        http.post(BTPATH.SAVE_SUPPLIER_PARAM,$scope.config).success(function(data){
            if(common.isCurrentResponse(data)){
                tipbar.infoTopTipbar('保存设置成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'保存设置失败,服务器返回:'+data.message,3000,9999);
            }
        }); 
    };


    //查询参数
    $scope.searchParam = function(){
         http.post(BTPATH.QUERY_SUPPLIER_PARAM,$scope.config).success(function(data){
            if(common.isCurrentResponse(data)){
                $scope.$apply(function(){
                    $scope.config = $.extend(data.data,{
                        custNo:$scope.config.custNo,    
                    }) ;
                });
            }else{
                if(console) console.error(data.message);
            }
        });
    };


    //初始化页面
    commonService.initPage(function(){
        //当前操作员下机构（供应商列表）
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'supplierList').success(function(data){
            $scope.config.custNo = $scope.supplierList[0] ?$scope.supplierList[0].value : '';
            //查询参数
            $scope.searchParam();
        });

    });
    

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

