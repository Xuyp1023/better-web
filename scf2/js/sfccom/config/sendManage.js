/*
发货单查询
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


  //控制器区域
  mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
    /*VM绑定区域*/
    $scope.statusList = BTDict.DeliveryNoticeStatus.toArray('value','name');
    $scope.custList = [];
    $scope.creditInfo = [];
    $scope.isSelectShow = true;
    $scope.searchData = {
      custNo:'',
      noticeNo:'',
      businStatus:$scope.statusList[0].value,
      GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEregDate:new Date().format('YYYY-MM-DD')
    };
    //分页数据
    $scope.listPage = {
      pageNum: 4,
      pageSize: 5,
      pages: 10,
      total: 50
    };
    //发货单列表
    $scope.infoList = [];
    //单个发货单信息
    $scope.info = {};
    //文件列表
    $scope.uploadList = [];

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

    //删除附件项
    $scope.delUploadItem = function(item,listName){
      $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
    };

    /*事件处理区域*/
    //查询发货单
    $scope.searchList = function(){
      $scope.listPage.pageNum = 4;
      $scope.queryList(true);
    };

    //查询发货单变动
    $scope.searchQuotaChangeList = function(){
      $scope.quotaChangeListPage.pageNum = 1;
      $scope.queryQuotaChange(true);
    };

    //获取发货单申请列表
    $scope.queryList = function(flag){
      //弹出弹幕加载状态
      var $mainTable = $('#search_info .main-list');
      loading.addLoading($mainTable,common.getRootPath());
      $scope.listPage.flag = flag? 1 : 2;
      http.post(BTPATH.QUERY_ALL_DEVLILIST,$.extend({},$scope.listPage,$scope.searchData))
        .success(function(data){
          //关闭加载状态弹幕
          loading.removeLoading($mainTable);
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
              $scope.infoList = common.cloneArrayDeep(data.data);
              if(flag){
                // $scope.listPage = data.page;
              }
            });
          }   
      });
    };


    //增加发货单
    $scope.addInfo = function(target){

      //设置校验项 | 校验
      validate.validate($('#add_box'),validOption);
      var valid = validate.validate($('#add_box'));
      if(!valid) return;

      var $target = $(target);
      $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
      http.post(BTPATH.ADD_ONE_DEVLILIST,$scope.info)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('添加发货单成功!',{});
            $scope.queryList(true);
            $scope.closeRollModal("add_box");
          }else{
            tipbar.errorTopTipbar($target,'添加发货单失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };


    //编辑发货单
    $scope.editInfo = function(target){

      //设置校验项 | 校验
      validate.validate($('#edit_box'),validOption);
      var valid = validate.validate($('#edit_box'));
      if(!valid) return;

      var $target = $(target);
      $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
      http.post(BTPATH.EDIT_ONE_DEVLILIST,$scope.info)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('修改发货单成功!',{});
            $scope.queryList(true);
            $scope.closeRollModal("edit_box");
          }else{
            tipbar.errorTopTipbar($target,'修改发货单失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };


    //删除发货单
    $scope.delInfo = function(target,data){
      data.businStatus = '-1';
      dialog.confirm('是否确认删除该发货单,该操作无法恢复!',function(){
        var $target = $(target);
        http.post(BTPATH.EDIT_ONE_DEVLILIST,data)
           .success(function(data){
            if(data&&(data.code === 200)){
              $scope.queryList(true);
              tipbar.infoTopTipbar('删除发货单成功!',{});
            }else{
              tipbar.errorTopTipbar($target,'删除发货单失败,服务器返回:'+data.message,3000,9992);
            }
           });
      });
    };

    //页面初始化
    $scope.initPage = function(){
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
        $scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
        $scope.queryList(true);
      });
    };

    /*
     *模板显隐控制区域
    */

    //打开发货单录入
    $scope.addInfoBox = function(){
      $scope.info = {
        custNo:$scope.custList[0].value
      };
      $scope.uploadList = [];
      $scope.openRollModal('add_box');
    };

    //打开发货单编辑
    $scope.editInfoBox = function(data){
      $scope.info = data;
      //查询附件列表
      commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'uploadList');
      $scope.openRollModal('edit_box');
    };

    /*数据初始区域*/
    $scope.initPage();


    //校验配置
    var validOption = {
          elements: [{
              name: 'info.custNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'info.noticeNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'info.balance',
              rules: [{name: 'required'},{name: 'int'}],
              events: ['blur']
          },{
              name: 'info.amount',
              rules: [{name: 'required'},{name: 'int'}],
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

