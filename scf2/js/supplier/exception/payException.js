/*
融资管理 (对接外部)
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
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){

    //初始分页数据
    function initPageConf(){
      return {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
    }

    /*字典数据*/
    
		/*VM绑定区域*/
		//分页数据
		$scope.pageConf = initPageConf();
    //异常列表
    $scope.exceptionList = [];
    
    
    //查询条件  
    $scope.searchData = {
      custNo:'',
      //发布时间
      GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEactualDate:new Date().format('YYYY-MM-DD')
    };


    // ------------------------------------------------ 业务操作 start -------------------------------------------------------

    //点击 “查询”  -刷新列表
    $scope.searchList = function(){
        $scope.pageConf.pageNum = 1;
        $scope.queryList(true);
    };


    //刷新融资申请列表
    $scope.queryList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_ALL_ENQUIRY_APPLY,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($('#search_info table'));
            if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    $scope.exceptionList = common.cloneArrayDeep(data.data);
                    if(flag){
                      $scope.pageConf = data.page;
                    }
                });
            }   
        });
    };



		/* ============================弹出面板 start ==============================*/

    /* ============================弹出面板 end ==============================*/




    //初始化页面
    commonService.initPage(function(){
      //当前操作员下机构（供应商列表）
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'supplierList').success(function(){
          $scope.searchData.custNo = $scope.supplierList[0].value;
          //查询保理机构 @todo
          //核心企业 @todo

          //查询融资列表
          $scope.queryList(true);
      });
      
    });
    

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

