/*
票据查询
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


  //控制器区域
  mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
    $scope.factorList = [];
    $scope.coreCustList = [];
    /*VM绑定区域*/
    $scope.searchData = {
      invoiceCorp:'',
      billNo:'',
      factorNo:'',
      GTEinvoiceDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEinvoiceDate:new Date().format('YYYY-MM-DD')
    };
    //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
    //历史票据列表
    $scope.infoList = [];
    

    /*事件处理区域*/
    //查询汇票管理
    $scope.searchList = function(){
      $scope.listPage.pageNum = 1;
      $scope.queryList(true);
    };

    //根据机构联动查询条件
    $scope.changeCust = function(){
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList','CoreCustListDic').success(function(){
          $scope.searchData.invoiceCorp = $scope.coreCustList[0].value;
          $scope.queryList(true);
        });
    };
    

    //获取汇票管理申请列表
    $scope.queryList = function(flag){
      //弹出弹幕加载状态
      var $mainTable = $('#search_info .main-list');
      loading.addLoading($mainTable,common.getRootPath());
      $scope.listPage.flag = flag? 1 : 2;
      http.post(BTPATH.QUERY_FINANCED_BY_FACTOR,$.extend({},$scope.listPage,$scope.searchData))
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


    //页面初始化
    $scope.initPage = function(){
      //获取机构列表
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','factorListDic').success(function(){
        $scope.searchData.factorNo = $scope.factorList[0].value;
        //获取保理机构对应的核心企业
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList','CoreCustListDic').success(function(){
          $scope.searchData.invoiceCorp = $scope.coreCustList[0].value;
          $scope.queryList(true);
        });

      });
    };


    /*数据初始区域*/
    $scope.initPage();

  }]);



  //手动装载angular模块
  angular.bootstrap($('#container'),['mainApp']);
});
});
});

