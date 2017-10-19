/*
未读消息查询
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
    require('editor');
    var base64 = require('base64');

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','editor']);

	//扩充公共指令库|过滤器|服务
    comdirect.direcPlus(mainApp);
    comfilter.filterPlus(mainApp);
    comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','commonService','http',function($scope,commonService,http){
		/*VM绑定区域*/
		

		//消息列表
		$scope.messageList = [];
		//消息详情
		$scope.messageInfo = {};

		//机构列表
        $scope.custList = [];

        //附件列表
        $scope.attachList = [];

        //查询条件
        $scope.searchData = {
            custNo:'',
            LIKEsubject : '',
            GTEsentDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
            LTEsentDate:new Date().format('YYYY-MM-DD')
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
            $scope.reFreshMessageList(true);
        };


        //刷新已读消息列表数据
        $scope.reFreshMessageList = function(flag){
            //是否需要分页信息 1：需要 2：不需要
            $scope.listPage.flag = flag ? 1 : 2;
            //弹出弹幕加载状态
            loading.addLoading($('#search_info table'),common.getRootPath());
            http.post(BTPATH.QUERY_UNREAD_NOTIFICATION,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($('#search_info table'));
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                      $scope.messageList = common.cloneArrayDeep(data.data);
                      if(flag){
                        $scope.listPage = data.page;
                      }
                  });
                }   
            });
        };



        //获取消息详情     id|消息ID
        $scope.findMessageDetail =function(item){
            if(!item.id) return;
            var promise = http.post(BTPATH.FIND_NOTIFICATION_DETAIL,{id:item.id}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.messageInfo = data.data;
                        // var content = base64.uriBase64Decode(data.data.content);
                        var editorObj = UE.loadEditor("messageInfoContent");
                        editorObj.setContent(data.data.content);
                        editorObj.disable();
                    });
                    //设置消息已读
                    $scope.setMessageRead(item);
                }   
            });
            return promise;
        };


        //设置消息已读
        $scope.setMessageRead = function(item){
            http.post(BTPATH.SET_READ_NOTIFICATION,{id:item.id,custNo:item.receiveCustNo});
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
        $scope.openMessageInfoBox = function(data){
            $scope.openRollModal("message_info_box");
            //置空
            $scope.messageInfo = {};
            $scope.attachList = [];
            UE.loadEditor("messageInfoContent").setContent("");
            //获取公告详情
            $scope.findMessageDetail(data).success(function(){
                //查询附件列表
                $scope.queryAttachList($scope.messageInfo.batchNo);
            });
        };


        //页面初始化
        commonService.initPage(function(){
            //当前操作员下机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
                $scope.searchData.custNo = $scope.custList[0].value;
                $scope.reFreshMessageList(true);
            });
        });

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

