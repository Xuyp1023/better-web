/*
  催收列表
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
  var comservice = require("service_s2");
  var BTPATH = require("path_s2");
  var pages = require("pages");
  var upload = require("upload");
  var date = require('date');
  require('modal');


  //定义模块
  var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);

  //扩充公共指令库|过滤器|服务
  comdirect.direcPlus(mainApp);
  comfilter.filterPlus(mainApp);
  comservice.servPlus(mainApp);
  //控制器区域
  mainApp.controller('mainController',['$scope','commonService','http',function($scope,commonService,http){


    //查询条件
    $scope.searchData = {
        requestNo : '',
        factorNo: ''
    };
    
    //分页配置
    $scope.pageConf = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };

    //保理公司列表
    $scope.factorList = [];
    //融资企业列表
    $scope.custList = [];

    //催收列表
    $scope.collRecordList = [];
    //催收详情
    $scope.pressMoneyInfo = {};


   //查询催收列表
    $scope.searchList = function(){
        $scope.pageConf.pageNum = 1;
        $scope.reFreshCollRecordList(true);
    };


    //刷新催收列表数据
    $scope.reFreshCollRecordList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_PRESS_MONEY_LIST,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($('#search_info table'));
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope.collRecordList = common.cloneArrayDeep(data.data);
                  if(flag){
                    $scope.pageConf = data.page;
                  }
              });
            }   
        });
    };


    //新增催收
    $scope.addCollRecord = function(target){
        http.post(BTPATH.ADD_PRESS_MONEY_INFO,$scope.pressMoneyInfo).success(function(data){
            if(data&&(data.code === 200)){
                //刷新催收列表
                $scope.reFreshCollRecordList(true);
                $scope.closeRollModal("add_box");
                tipbar.infoTopTipbar('新增催收成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'新增催收失败,服务器返回:'+data.message,3000,9992);
            }
         });
    };



    //---------------------------弹板操作-------------------------start


    //新增催收信息
    $scope.openAddCollecBox= function(){
      $scope.pressMoneyInfo = {};
      $scope.openRollModal('add_box');
    };

    //催收详情
    $scope.openDetailBox = function(data){
      $scope.pressMoneyInfo = data;
      $scope.openRollModal('detail_box');
    };


    //---------------------------弹板操作-------------------------end
    


    //页面初始化
    commonService.initPage(function(){
        //当前操作员下机构(保理公司)
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
           $scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
           //催收列表
           $scope.reFreshCollRecordList(true);
        });
    });



  }]);

  //手动装载angular模块
  angular.bootstrap($('#container'),['mainApp']);

});
});
});