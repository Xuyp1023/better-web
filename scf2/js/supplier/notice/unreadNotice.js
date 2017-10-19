/*
    已读公告 
    作者:herb
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
    var upload = require("upload");
    var modal = require('modal');
    // var multiple = require("multiSelect");
    require('date');
    require('editor');
    var base64 = require('base64');

    //定义模块
    var mainApp = angular.module('mainApp',['modal','date','pagination','editor','upload']);

    //扩充公共指令库|过滤器|服务
    comdirect.direcPlus(mainApp);
    comfilter.filterPlus(mainApp);
    comservice.servPlus(mainApp);

    //控制器区域
    mainApp.controller('mainController',['$scope','commonService','http',function($scope,commonService,http){
        /*VM绑定区域*/


        //公告列表
        $scope.noticeList = [];
        //公告详情
        $scope.noticeInfo = {};
        //机构列表
        $scope.custList = [];

        //附件列表
        $scope.attachList = [];

        //查询条件
        $scope.searchData = {
            custNo:'',
            LIKEsubject : '',
            GTEpublishDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
            LTEpublishDate:new Date().format('YYYY-MM-DD')
        };

        //分页数据
        $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
        };

        /*事件处理区域*/
        //查询资料代录
        $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.reFreshNoticeList(true);
        };


        //刷新已读公告列表数据
        $scope.reFreshNoticeList = function(flag){
            //是否需要分页信息 1：需要 2：不需要
            $scope.listPage.flag = flag ? 1 : 2;
            //弹出弹幕加载状态
            loading.addLoading($('#search_info table'),common.getRootPath());
            http.post(BTPATH.QUERY_UNREAD_NOTICE,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($('#search_info table'));
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                      $scope.noticeList = common.cloneArrayDeep(data.data);
                      if(flag){
                        $scope.listPage = data.page;
                      }
                  });
                }   
            });
        };


        //获取公告详情     id|公告ID
        $scope.findNoticeDetail =function(item){
            if(!item.id) return;
            var promise = http.post(BTPATH.FIND_NOTICE_DETAIL,{id:item.id}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.noticeInfo = data.data;
                        var content = base64.uriBase64Decode(data.data.content);
                        var editorObj = UE.loadEditor("noticeInfoContent");
                        editorObj.setContent(content);
                        editorObj.disable();
                    });
                    //设置公告已读
                    $scope.setNoticeRead(item);
                }   
            });
            return promise;
        };

        
        //设置公告已读
        $scope.setNoticeRead = function(item){
            http.post(BTPATH.SET_READ_NOTICE,{id:item.id,custNo:item.receiveCustNo});
        };


        //查询附件列表
        $scope.queryAttachList = function(batchNo){
            if(!batchNo) return;
            http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.attachList = common.cloneArrayDeep(data.data);
                    });
                }   
            });
        };


        /*
         *模板显隐控制区域
        */
        //打开公告详情
        $scope.openNoticeInfoBox = function(data){
            $scope.openRollModal("notice_detail_box");
            //置空
            $scope.noticeInfo = {};
            $scope.attachList = [];
            UE.loadEditor("noticeInfoContent").setContent("");
            //获取公告详情
            $scope.findNoticeDetail(data).success(function(){
                //查询附件列表
                $scope.queryAttachList($scope.noticeInfo.batchNo);
            });
        };


        //页面初始化
        commonService.initPage(function(){
            //当前操作员下机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
                $scope.searchData.custNo = $scope.custList[0].value;
                $scope.reFreshNoticeList(true);
            });
        });

    }]);



    //手动装载angular模块
    angular.bootstrap($('#container'),['mainApp']);
});
});
});

