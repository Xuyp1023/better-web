/*
询价 (对接外部)
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
    //票据流通方式
    $scope.billFlowModes = BTDict.BillFlowMode.toArray('value','name');

    $scope.enquiryStrategys = BTDict.ScfEnquiryStrategy.toArray('value','name');
    
    

		/*VM绑定区域*/
		//分页数据
		$scope.pageConf = initPageConf();
    //报价列表分页数据
    $scope.offerPageConf = initPageConf();

    //供应商列表
    $scope.supplierList = [];
    //票据列表（下拉）
    $scope.draftList = [];
    //票据详情
    $scope.draftInfo = {};
    //金融公司列表(下拉)
    $scope.factorList = [];
    //金融公司报价列表
    $scope.priceList = [];
      //金融公司报价列表
    $scope.objectList = [];
    
    //查询条件  
    $scope.searchData = {
      custNo:'',
      //发布时间
      GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEactualDate:new Date().format('YYYY-MM-DD')
    };


    // ------------------------------------------------ 业务操作 start -------------------------------------------------------

    //点击 “查询”  -刷新询价列表
    $scope.searchList = function(){
        $scope.pageConf.pageNum = 1;
        $scope.queryInquiryList(true);
    };

		//询价列表
		$scope.inquiryList = [];
    //询价详情
    $scope.inquiryInfo = {};


    //获取报价列表
    $scope.queryObjectList = function(enquiryNo){
      return http.post(BTPATH.QUERY_OFFER_BY_ENQUIRY_OBJECT,{enquiryNo:enquiryNo}).success(function(data){
        if(common.isCurrentResponse(data)){
          $scope.$apply(function(){
            $scope.objectList = data.data;
          });
        }else{
          mui.alert('未查询到对应报价信息,服务端\n返回信息:'+data.message,'错误信息');
        }
      });
    };

    //刷新询价列表
    $scope.queryInquiryList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_BILL_ENQUIRY_LIST,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($('#search_info table'));
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                  $scope.inquiryList = common.cloneArrayDeep(data.data);
                  if(flag){
                    $scope.pageConf = data.page;
                  }
              });
            }   
        });
    };

    //刷新报价列表
    $scope.queryPriceList = function(enquiryNo){
        http.post(BTPATH.FIND_OFFER_LIST,{enquiryNo:enquiryNo}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                  $scope.priceList = common.cloneArrayDeep(data.data);
              });
            }   
        });
    };


    //查询票据详情
    $scope.findDraftInfo = function(id){
        http.post(BTPATH.FIND_DRAFT_DETAIL,{id:id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.draftInfo = data.data;
              });
            }
        });
    };


    //新增询价
    $scope.addInquiry = function(target){

        //设置校验项 | 校验
        validate.validate($('#add_inquiry_box'),validOption);
        var valid = validate.validate($('#add_inquiry_box'));
        if(!valid) return;

        //金融机构
        if(!$scope.inquiryInfo.factors){
          tipbar.errorLeftTipbar($(target),'请选择金融机构！',3000,999999);
          return false;
        }

        $scope.inquiryInfo.requestType=2;
        $scope.inquiryInfo.enquiryMethod=2;
        http.post(BTPATH.ADD_ENQUIRY,$scope.inquiryInfo).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('新增询价成功!',{});
                  //刷新列表数据
                  $scope.queryInquiryList(true);
                  $scope.closeRollModal("add_inquiry_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'新增询价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };




		/* ============================弹出面板 start ==============================*/

		//发布询价
		$scope.showAddBox = function(){
        //置空对象
        $scope.inquiryInfo = {};
        $scope.draftInfo = {};
        $scope.openRollModal("add_inquiry_box",null,function(){
            multiple.resizeWidth();
        });
        //查询票据下拉列表,并默认选中第一个 @todo
        commonService.queryBaseInfoList(BTPATH.QUERY_BILL_LIST_NORMAL,{custNo:$scope.searchData.custNo},$scope,'draftList').success(function(){
            //默认选中第一个 @todo
            $scope.inquiryInfo.billId = $scope.draftList[0] ? $scope.draftList[0].id : ''; 
            $scope.inquiryInfo.strategy =  $scope.enquiryStrategys[0].value;
            $scope.inquiryInfo.orders = $scope.inquiryInfo.billId;
            $scope.inquiryInfo.custNo=$scope.searchData.custNo;
            //查询票据详情
            $scope.findDraftInfo($scope.inquiryInfo.billId);
        });
        
        //金融机构列表
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList');
		};

		//询价报价详情
		$scope.showDetailBox = function(data){
       //从列表获取详情
       $scope.queryObjectList(data.enquiryNo);
       $scope.inquiryInfo = data;
       $scope.queryPriceList(data.enquiryNo);
       $scope.openRollModal("inquiry_detail_box");
		};

    /* ============================弹出面板 end ==============================*/




    //初始化页面
    commonService.initPage(function(){
      //当前操作员下机构（供应商列表）
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'supplierList').success(function(){
          $scope.searchData.custNo = $scope.supplierList[0].value;
          //查询询价列表
          $scope.inquiryInfo.custNo=$scope.supplierList[0].value;
          $scope.queryInquiryList(true);
      });
      
    });
    

    //校验配置
    var validOption = {
          elements: [
          {
              name: 'inquiryInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          },
          {
              name: 'inquiryInfo.ratio',
              rules: [{name: 'required'}],
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

