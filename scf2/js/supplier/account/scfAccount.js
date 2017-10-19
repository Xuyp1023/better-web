/*
保理开户
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

  //扩充公共指令库|过滤器|服务
  comdirect.direcPlus(mainApp);
  comfilter.filterPlus(mainApp);
  comservice.servPlus(mainApp);

  //控制器区域
  mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
    /*VM绑定区域*/
    $scope.contractCompList = BTDict.ScfElecAgreementGroup.toArray('value','name');
    $scope.factorComList = BTDict.ScfFactorGroup.toArray('value','name');
    $scope.custList = [];

    //==============================公共操作区 start=================================
    //单个保理开户信息
    $scope.baseInfo = {
      custNo:'',
      postscript:'',
      openStatus:'',
      readAndAgreee:false  //阅读并同意
    };
    //开户保理列表
    $scope.factorInfoList = [];
    //开户电子合同机构列表
    $scope.contractInfoList = [];
    //开户所需资料
    $scope.fundCompInfoList =[];
    $scope.fundCompProList = [];
    //保理开户审批列表
    $scope.openedCheckList = [];   


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

    /*事件处理区域*/
    //查询保理开户
    $scope.changeCust = function(){
      $scope.baseInfo = $.extend($scope.baseInfo,{
        postscript:'',
        readAndAgreee:false
      });
      $scope.queryBaseInfo();
      $scope.queryFactorOpened();
      $scope.queryContractComOpened();
      $scope.queryOpenedCheckList();
    };

    //获取机构开通保理 状态
    $scope.queryBaseInfo = function(){
      //弹出弹幕加载状态
      var $mainTable = $('#base_info');
      loading.addLoading($mainTable,common.getRootPath());
      http.post(BTPATH.QUERY_DIC_FACTORSTATUS,{custNo:$scope.baseInfo.custNo})
        .success(function(data){
          //关闭加载状态弹幕
          loading.removeLoading($mainTable);
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.baseInfo.openStatus = data.data;
            });
          }   
      });
    };


    //获取到开户的保理机构
    $scope.queryFactorOpened = function(){
      $scope.factorComList = BTDict.ScfFactorGroup.toArray('value','name');
      http.post(BTPATH.QUERY_OPENED_FACTOR,{custNo:$scope.baseInfo.custNo})
        .success(function(data){
          //关闭加载状态弹幕
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.factorInfoList = ArrayPlus(data.data).extractChildArray('value');
              $scope.factorComList = ArrayPlus($scope.factorComList).linkAnotherArray($scope.factorInfoList,'value','checked',true);
            });
          }   
      });
    };

    //获取到开户的电子合同机构
    $scope.queryContractComOpened = function(){
      $scope.contractCompList = BTDict.ScfElecAgreementGroup.toArray('value','name');
      http.post(BTPATH.QUERY_OPENED_CONTRACTCOM,{custNo:$scope.baseInfo.custNo})
        .success(function(data){
          //关闭加载状态弹幕
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.contractInfoList = ArrayPlus(data.data).extractChildArray('value');
              $scope.contractCompList = ArrayPlus($scope.contractCompList).linkAnotherArray($scope.contractInfoList,'value','checked',true);
              //默认选中沃通
              $scope.contractCompList[0].checked = true;
            });
          }   
      });
    };

    //获取机构开户资料列表
    $scope.queryOpenedSourceList = function(item){
      var promise = http.post(BTPATH.SALE_AGENCY_INFO_PATH,{agencyNo:item.value})
        .success(function(data){
          //关闭加载状态弹幕
          if(common.isCurrentData(data)){
            var compInfoList = data.data.files;
            $scope.$apply(function(){
              $scope.fundCompInfoList = ArrayPlus(compInfoList).objectChildFilter('paperType','0');
              $scope.fundCompProList = ArrayPlus(compInfoList).objectChildFilter('paperType','1');
            });
          }   
      });
      return promise;
    };

    //获取到保理开户的审批列表
    $scope.queryOpenedCheckList = function(){
      http.post(BTPATH.QUERY_SCFOPENED_CHECKLIST,{custNo:$scope.baseInfo.custNo})
          .success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.openedCheckList = common.cloneArrayDeep(data.data);
              });
            }
          });
    };

    //提交保理开户
    $scope.openedScfAccount = function(target){
      var $target = $(target),
          factorList = form.getCheckboxValueArray($('#factor_table [ng-checkbox-array]')),
          providerList = form.getCheckboxValueArray($('#contract_table [ng-checkbox-array]')),
          isConfirmProtocol = $('#sign_protocol_checkbox')[0].checked;
      /*操作校验*/
      if((factorList.length<=$scope.factorInfoList.length)&&(factorList.length<$('#factor_table [ng-checkbox-array]').length)){
        tipbar.errorTopTipbar($target,'您还未选择需要新开户的保理机构!',3000,9992);
        return;
      }
      if((providerList.length === 0)){
        tipbar.errorTopTipbar($target,'您还未选择需要开通的电子合同服务商!',3000,9992);
        return;
      }
      if(!isConfirmProtocol){
        tipbar.errorTopTipbar($target,'请确认是否已同意相关开户协议!',3000,9992);
        return;
      }
      $scope.baseInfo.factorList = factorList.join(",");
      $scope.baseInfo.providerList = providerList.join(",");
      http.post(BTPATH.OPENED_SCF_ACCOUNT,$scope.baseInfo)
         .success(function(data){
          if(common.isCurrentResponse){
            //刷新数据
            $scope.changeCust();
            tipbar.infoTopTipbar('保理开户成功,请等待保理公司审核!',{});
            // tipbar.errorTopTipbar($target,'保理开户成功,请等待保理公司审核!',3000,9992);
          }else{
            tipbar.errorTopTipbar($target,'保理开户失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };


    
    //弹出框高度变化，自动resize.
    $scope.$on('ngRepeatFinished',function(){
        common.resizeIframeListener();   
    });


    //页面初始化
    $scope.initPage = function(){
      var basePromise = commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic');
      basePromise.success(function(){
        $scope.$apply(function(){
          $scope.baseInfo.custNo = $scope.custList[0].value;
        });
        $scope.queryBaseInfo();
        $scope.queryFactorOpened();
        $scope.queryContractComOpened();
        $scope.queryOpenedCheckList();
      });
    };

    /*
     *模板显隐控制区域
    */
    //打开所需资料面板
    $scope.souceListBox = function(item){
      $scope.queryOpenedSourceList(item).success(function(){
        $scope.openRollModal('source_box');
      });
    };
    //==============================公共操作区 end ==================================
    /*数据初始区域*/
    $scope.initPage();


  }]);



  //手动装载angular模块
  angular.bootstrap($('#container'),['mainApp']);
});
});
});


