/*
  经销商融资列表
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
    var date = require('date');
    require('modal');


  //定义模块
  var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
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

    //附件列表
    $scope.attachList = [];



    //---------------------------弹板操作-------------------------start


    //---------------------------弹板操作-------------------------end
    

    //打开详情面板
    $scope.openDetailBox= function(){
      $scope.openRollModal('apply_detail_box');
    };

    //还款
    $scope.payment= function(){
      $scope.openRollModal('payment_info_box');
    };

    //提前还款
    $scope.paymentAdvance= function(){
      $scope.openRollModal('payment_advance_box');
    };

    //逾期还款
    $scope.paymentDelay= function(){
      $scope.openRollModal('payment_delay_box');
    };

    //编辑催收信息
    $scope.editCollRecord= function(){
      $scope.openRollModal('edit_collrecord_info_box');
    };







  }]);

  //手动装载angular模块
  angular.bootstrap($('#container'),['mainApp']);

});
});
});