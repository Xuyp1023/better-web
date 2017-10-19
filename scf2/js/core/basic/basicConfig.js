/*
基础设置 (核心企业)
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
	//配置对象
	$scope.config = {
        custNo:'',
        day:'',
        agencyNo:''
    };
	//核心企业列表
	$scope.coreCustList = [];
	//待选保理公司列表
	$scope.factorList = [];
	//已选保理公司列表
	$scope.selFactorList = []; 
    
    


    // ------------------------------------------------ 业务操作 start -------------------------------------------------------

    //移除
    $scope.removeItem = function(item){
    	$scope.selFactorList = ArrayPlus($scope.selFactorList).delChild('value',item.value);
        $scope.factorList = new ArrayPlus($scope.factorList).setKeyArrayObj("add",false,"value",item.value);
    };

    //添加
    $scope.addItem = function(item){
    	$scope.selFactorList.push(item);
        $scope.factorList = new ArrayPlus($scope.factorList).setKeyArrayObj("add",true,"value",item.value);
    };

    //移除所有
    $scope.removeAll = function(){
    	$scope.selFactorList = [];
        $scope.factorList = new ArrayPlus($scope.factorList).setKeyArrayObj("add",false);
    };

    //添加所有
    $scope.addAll = function(){
    	$scope.selFactorList = common.cloneArrayDeep($scope.factorList);
        $scope.factorList = new ArrayPlus($scope.factorList).setKeyArrayObj("add",true);
    };




	/* ============================弹出面板 start ==============================*/

    /* ============================弹出面板 end ==============================*/


    /*公共绑定*/
     $scope.$on('ngRepeatFinished',function(){
      	common.resizeIframeListener();  
     });


     // 保存参数
     $scope.saveParam = function(target){
        var sel = new ArrayPlus($scope.selFactorList).extractChildArray("value",true);
        /*if(!sel){
            tipbar.errorTopTipbar($(target),"请选择金融机构！",3000,9999);
            return false;
        }*/
        $scope.config.agencyNo = sel;
        http.post(BTPATH.SAVE_CORE_PARAM,$scope.config).success(function(data){
            if(common.isCurrentResponse(data)){
                tipbar.infoTopTipbar('保存设置成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'保存设置失败,服务器返回:'+data.message,3000,9999);
            }
        }); 
    };


    //查询参数
    $scope.searchParam = function(){
         http.post(BTPATH.QUERY_CORE_PARAM,$scope.config).success(function(data){
            if(common.isCurrentResponse(data)){
                $scope.$apply(function(){
                    $scope.config = $.extend(data.data,{
                        custNo:$scope.config.custNo,    
                    }) ;
                    var checkStr = $scope.config.agencyNo;
                    //过滤出已选择记录
                    $scope.selFactorList = new ArrayPlus($scope.factorList).objectChildFilterByStr("value",checkStr);
                    //为已选择的记录添加 “add” 属性
                    $scope.factorList = new ArrayPlus($scope.factorList).setKeyArrayObjByStr("value",checkStr,"add",true,false);
                });
            }else{
                if(console) console.error("错误：后台返回" + data.message);
            }
        });
    };



    //初始化页面
    commonService.initPage(function(){
        //当前操作员下机构（核心企业列表）
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){
        	var coreCustNo = $scope.coreCustList[0] ?　$scope.coreCustList[0].value : '';
            $scope.config.custNo = coreCustNo;
        	//保理公司列表
        	commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:coreCustNo},$scope,'factorList').success(function(){
        		$scope.config.custNo = $scope.coreCustList[0] ?$scope.coreCustList[0].value : '';
                //查询参数
                $scope.searchParam();
        	});
        });
        
    });
    

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

