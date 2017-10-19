/*
参数设置查询
作者:bhg
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

  //兼容IE模式
  // .config(function($sceProvider){
  //  $sceProvider.enabled(false);
  // })

  //控制器区域
  mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
    /*VM绑定区域*/
    //单个参数设置信息
    $scope.info = {};
    //操作企业列表
    $scope.custList = [];
    // 平台模式
    $scope.remotingStaus = BTDict.FactorParamRemotingStatus.toArray('value','name');
    // 授信模式
    $scope.creditStatus = BTDict.FactorParamCreditStatus.toArray('value','name');
    //是否自动发布询价
    $scope.autoEnquiryStatus = BTDict.AutoEnquiryStatus.toArray('value','name');
    

    /*事件处理区域*/
    //初始化参数设置
    $scope.loadInfo = function(){
      //弹出弹幕加载状态
      var $mainTable = $('#config_box .main-list');
      loading.addLoading($mainTable,common.getRootPath());
      http.post(BTPATH.QUERY_ALL_FACTORPARAM,{custNo:$scope.info.custNo})
        .success(function(data){
          //关闭加载状态弹幕
          loading.removeLoading($mainTable);
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
              $scope.info = data.data;
            });
          }   
          //是否自动发布询价
          $scope.info.autoEnquiry = $scope.info.autoEnquiry||$scope.autoEnquiryStatus[0].value;
      });
    };  


    //编辑参数设置
    $scope.editInfo = function(target){
      //设置校验项 | 校验
      validate.validate($('#config_box'),validOption);
      var valid = validate.validate($('#config_box'));
      if(!valid) return;
      
      var $target = $(target);
      http.post(BTPATH.ADD_ONE_FACTORPARAM,$scope.info)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.errorTopTipbar($target,'修改参数设置成功!',3000,9992);
          }else{
            tipbar.errorTopTipbar($target,'修改参数设置失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };


    //操作企业切换
    $scope.custSwitch = function(){
        //导入参数信息
        $scope.loadInfo();
    };


    //页面初始化
    $scope.initPage = function(){
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
        //默认选择第一个操作企业
        $scope.info.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
        $scope.loadInfo(true);
      });
    };

    /*
     *模板显隐控制区域
    */

    /*数据初始区域*/
    $scope.initPage();


    //校验配置
    var validOption = {
          elements: [{
              name: 'info.graceDays',
              rules: [{name: 'number'}],
              events: ['blur']
          },{
              name: 'info.countDays',
              rules: [{name: 'number'},{name:'nozero'}],
              events: ['blur']
          },{
              name: 'info.penaltyRatio',
              rules: [{name: 'float'},{name:'nozero'}],
              events: ['blur']
          },{
              name: 'info.latefeeRatio',
              rules: [{name: 'float'},{name:'nozero'}],
              events: ['blur']
          },{
              name: 'info.advanceRepaymentRatio',
              rules: [{name: 'float'},{name:'nozero'}],
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

